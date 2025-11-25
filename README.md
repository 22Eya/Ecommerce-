# 🛍️ e-commerce App - React Native

This project is a React Native e-commerce mobile application designed to provide users with a seamless shopping experience. It includes features such as user authentication, product browsing, a shopping cart, and user profile management. The app integrates with local storage for cart persistence and simulates various e-commerce functionalities, offering a comprehensive mobile shopping solution.

## 🚀 Key Features

- **User Authentication:** Sign-in, sign-up, and password recovery flows.
- **Product Browsing:** Browse shops and view product details.
- **Shopping Cart:** Add, remove, and update items in a cart.
- **User Profile:** View user information, progress, and achievements.
- **Local Storage:** Utilizes `AsyncStorage` for persistent data storage (cart, user points, etc.).
- **Navigation:** Stack and Tab based navigation using `react-navigation`.
- **Daily Login Bonus:** Rewards users with points for daily logins.
- **Monthly Challenges:** Participate in ticket hunt challenges at specific shops.
- **Voice Integration:** Voice modal for interactive features.

## 🛠️ Tech Stack

*   **Frontend:**
    *   React Native
    *   React

*   **Navigation:**
    *   `@react-navigation/native`
    *   `@react-navigation/stack`
    *   `@react-navigation/bottom-tabs`
*   **Data Storage:**
    *   `@react-native-async-storage/async-storage`
*   **UI Libraries:**
    *   `@expo/vector-icons`
    *   `react-native-safe-area-context`
    *   `react-native-screens`
    *   `react-native-gesture-handler`
*   **Other:**
    *   TypeScript
    *   Expo
    *   axios (for API calls, though not heavily used in provided snippets)
    *   react-native-qrcode-svg (for generating QR codes)

## 📦 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (>=16)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A mobile device (Android or iOS) or emulator

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd ecommerce
    ```

2.  Install dependencies:

    ```bash
    npm install  # or yarn install
    ```

### Running Locally

1.  Start the Expo development server:

    ```bash
    npm start  # or yarn start
    ```

2.  Scan the QR code with the Expo Go app on your mobile device, or run on an emulator.

    *   For Android emulator: `npm run android`
    *   For iOS simulator: `npm run ios`

## 📂 Project Structure

```
ecommerce/
├── App.tsx                  # Root component
├── assets/                  # Image assets
├── src/
│   ├── components/          # Reusable components (if any)
│   ├── constants/
│   │   └── challenge.ts     # Challenge-related constants
│   ├── navigation/
│   │   ├── appnavigation.tsx  # Main stack navigator
│   │   └── Tabnavigator.tsx   # Bottom tab navigator
│   ├── screens/
│   │   ├── auth/            # Authentication screens
│   │   │   ├── ForgetPass.tsx # Forget Password screen
│   │   │   ├── Signin.tsx     # Sign-in screen
│   │   │   ├── Signup.tsx     # Sign-up screen
│   │   │   └── Welcome.tsx    # Welcome screen
│   │   └── main/            # Main application screens
│   │       ├── Cart.tsx       # Cart screen
│   │       ├── HomeScreen.tsx   # Home screen
│   │       ├── Payment.tsx      # Payment screen
│   │       ├── product.tsx      # Product details screen
│   │       ├── Profile.tsx      # User profile screen
│   │       ├── ShopList.tsx   # Shop List screen
│   │       ├── ShopScreen.tsx   # Shop screen
│   │       └── Ticket.tsx     # Ticket screen
│   │   └── voice/           # Voice related screen
│   │       └── VoiceScreen.tsx # Voice screen
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── utils/               # Utility functions (if any)
├── app.json                 # Expo configuration file
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation (this file)
```



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.


## 📬 Contact

If you have any questions or suggestions, feel free to contact me at eyaboualllegue@gmail.com.

## 💖 Thanks

Thank you for checking out this project! I hope it's helpful and provides a good starting point for your React Native e-commerce app development.
tachments/assets/3e89acd9-04f4-4d63-9aca-bbb6f3199ff1" />
⚠️ Dans le code, BACKEND_URL doit pointer vers leur propre machine, pas la tienne.
Le plus simple pour eux : mettre par défaut
const BACKEND_URL = 'http://10.0.2.2:8000';
et utiliser un émulateur Android (dans ce cas, tout tourne sur le même PC).

Étape C – Installer et lancer le backend (FastAPI)

Depuis la racine du projet :

cd backend
python -m venv .venv
# Windows :
.\.venv\Scripts\activate
# Linux/macOS :
# source .venv/bin/activate

pip install -r requirements.txt


Puis ils créent leur propre fichier backend/.env :

HF_API_TOKEN=hf_leurs_token_à_eux
HF_MODEL_ID=meta-llama/Meta-Llama-3-8B-Instruct
HF_API_TOKEN

Chaque personne doit avoir son propre compte Hugging Face et son propre token (on ne partage pas le tien).

Les étapes (pour tes camarades) :

Aller sur https://huggingface.co

Créer un compte ou se connecter

En haut à droite, cliquer sur l’avatar → Settings

Dans le menu à gauche, aller sur Access Tokens

Cliquer sur New token / Create new token

Remplir :

Name : par ex. mall-assistant

Role / Permissions : Read


Enfin, lancer deux terminales le serveur :

uvicorn main:app --reload --port 8000 --host 0.0.0.0
et un autre terminal pour npx expo start

S’ils utilisent émulateur Android → BACKEND_URL = 'http://10.0.2.2:8000'

S’ils utilisent Expo Go sur téléphone :

trouver leur IP avec ipconfig (par ex. 192.168.x.y)

mettre BACKEND_URL = 'http://192.168.x.y:8000'