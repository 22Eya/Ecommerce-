import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Msg = {
  id: string;
  from: 'user' | 'bot';
  text: string;
};

// Téléphone réel sur le même Wi-Fi : IP de ton PC
const BACKEND_URL = 'http://192.168.1.6:8000';

const VoiceScreen: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: '1',
      from: 'bot',
      text: 'Bienvenue au Mall of Sousse. Écris ta question puis appuie sur "Envoyer".',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessageToApi = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) {
      return;
    }

    const userMsg: Msg = {
      id: Date.now().toString(),
      from: 'user',
      text: trimmed,
    };

    const historyForApi = messages.map(m => ({
      from_role: m.from,
      text: m.text,
    }));

    // ajouter le message de l'utilisateur en haut
    setMessages(prev => [...prev, userMsg]);
    setSending(true);
    setInputText('');

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
        }),
      });

      if (!response.ok) {
        let detail = 'Erreur inconnue côté serveur.';
        try {
          const data = await response.json();
          if (data?.detail) {
            detail = data.detail;
          }
        } catch {
          // ignore erreur JSON
        }
        throw new Error(detail);
      }

      const data: { reply: string } = await response.json();

      const botMsg: Msg = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: data.reply || "Je n’ai pas pu générer de réponse.",
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue lors de l’appel au chatbot.";
      const botMsg: Msg = {
        id: (Date.now() + 2).toString(),
        from: 'bot',
        text: `Une erreur est survenue en contactant l’assistant : ${message}`,
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => {
    void sendMessageToApi(inputText);
  };

  const renderItem = ({ item }: { item: Msg }) => (
    <View style={[styles.msgRow, item.from === 'user' ? styles.msgRowUser : styles.msgRowBot]}>
      <View style={[styles.msgBubble, item.from === 'user' ? styles.userBubble : styles.botBubble]}>
        <Text style={item.from === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
      </View>
    </View>
  );

  // prévisualisation du message en cours d'écriture
  const dataWithPreview: Msg[] =
    inputText.trim().length > 0 && !sending
      ? [
          ...messages,
          {
            id: 'preview',
            from: 'user',
            text: inputText,
          },
        ]
      : messages;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Mall of Sousse</Text>
        <Text style={styles.heroSub}>Customer Service</Text>
      </View>

      <FlatList
        data={dataWithPreview}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />

      <View style={styles.footer}>
        {sending ? (
          <View style={styles.sendingRow}>
            <ActivityIndicator />
            <Text style={[styles.hintText, styles.sendingText]}>L’assistant répond...</Text>
          </View>
        ) : (
          <Text style={styles.hintText}>
            Écris ton message, tu le vois en haut, puis appuie sur "Envoyer".
          </Text>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Pose ta question ici..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSend}
            style={styles.sendButton}
            disabled={sending || !inputText.trim()}
          >
            <Text style={styles.sendText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eaf3ff' },
  hero: { paddingTop: 24, paddingBottom: 14, alignItems: 'center' },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#255bd6' },
  heroSub: { color: '#255bd6', opacity: 0.9, marginTop: 2 },
  chatList: { padding: 16, paddingBottom: 180 },
  msgRow: { marginVertical: 6 },
  msgRowUser: { alignItems: 'flex-end' },
  msgRowBot: { alignItems: 'flex-start' },
  msgBubble: { maxWidth: '85%', padding: 12, borderRadius: 12 },
  userBubble: { backgroundColor: '#255bd6' },
  botBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  userText: { color: '#fff' },
  botText: { color: '#333' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#eaf3ff' },
  hintText: { color: '#3b6fbf', marginBottom: 6, fontWeight: '600', textAlign: 'center' },
  sendingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  sendingText: { marginLeft: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#3478f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontWeight: '700' },
});

export default VoiceScreen;
