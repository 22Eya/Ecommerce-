import os
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient, InferenceTimeoutError
from huggingface_hub.errors import HfHubHTTPError
from pydantic import BaseModel

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL_ID = os.getenv("HF_MODEL_ID", "meta-llama/Meta-Llama-3-8B-Instruct")

if HF_API_TOKEN is None:
    raise RuntimeError("HF_API_TOKEN is not set in environment variables.")


client = InferenceClient(
    model=HF_MODEL_ID,
    token=HF_API_TOKEN,
    timeout=40,
)

SYSTEM_PROMPT = """
Tu es un assistant du centre commercial "Mall of Sousse".
Tu réponds aux questions sur les magasins, horaires, promotions,
parking et événements du mall.

Règles :
- Réponds en français.
- Réponds en 3 à 6 phrases maximum.
- Si la question n'est pas liée au centre commercial, précise que
  tu es limité au service client du mall.
"""


class HistoryMessage(BaseModel):
    """Message dans l'historique de discussion."""

    from_role: Literal["user", "bot"]
    text: str


class ChatRequest(BaseModel):
    """Requête envoyée par l'application mobile."""

    message: str
    history: Optional[List[HistoryMessage]] = None


class ChatResponse(BaseModel):
    """Réponse renvoyée au mobile."""

    reply: str


app = FastAPI(title="Mall Voice Assistant API")

# Autoriser ton appli React Native à appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en prod: mettre l'URL de ton front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_hf_messages(payload: ChatRequest) -> List[dict]:
    """
    Construit la liste de messages pour le modèle Hugging Face.

    Args:
        payload: Requête contenant message et historique.

    Returns:
        Liste de messages au format chat_completion.

    Raises:
        ValueError: si le message utilisateur est vide.
    """
    if not payload.message.strip():
        raise ValueError("Message must not be empty.")

    messages: List[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
    ]

    if payload.history:
        for msg in payload.history:
            role = "user" if msg.from_role == "user" else "assistant"
            messages.append({"role": role, "content": msg.text})

    messages.append({"role": "user", "content": payload.message})
    return messages


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    """
    Endpoint principal du chatbot.

    Args:
        payload: Requête de chat venant du frontend.

    Returns:
        Réponse générée par le modèle.

    Raises:
        HTTPException: en cas d'erreur de validation ou d'appel Hugging Face.
    """
    try:
        messages = build_hf_messages(payload)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    try:
        completion = client.chat_completion(
            messages=messages,
            max_tokens=256,
            temperature=0.2,
        )
    except InferenceTimeoutError as error:
        raise HTTPException(
            status_code=504,
            detail="Délai dépassé lors de l'appel au modèle.",
        ) from error
    except HfHubHTTPError as error:
        raise HTTPException(
            status_code=502,
            detail="Erreur lors de l'appel à l'API Hugging Face.",
        ) from error

    reply = completion.choices[0].message.content
    return ChatResponse(reply=reply)
