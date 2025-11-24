import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Msg = { id: string; from: 'user' | 'bot'; text: string };

const VoiceScreen: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', from: 'bot', text: 'Welcome to Mall voice assistant. Tap and speak to start.' },
  ]);
  const [listening, setListening] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulse.stopAnimation();
    pulse.setValue(1);
  };

  const onMicPress = () => {
    if (listening) {
      // stop listening and simulate a reply
      setListening(false);
      stopPulse();
      const userMsg: Msg = { id: Date.now().toString(), from: 'user', text: '...' };
      setMessages((m) => [...m, userMsg]);
      // simulate bot reply
      setTimeout(() => {
        const bot: Msg = { id: (Date.now() + 1).toString(), from: 'bot', text: 'Here is the information you asked for. Need anything else?' };
        setMessages((m) => [...m, bot]);
      }, 900);
    } else {
      // start listening
      setListening(true);
      startPulse();
    }
  };

  const renderItem = ({ item }: { item: Msg }) => (
    <View style={[styles.msgRow, item.from === 'user' ? styles.msgRowUser : styles.msgRowBot]}>
      <View style={[styles.msgBubble, item.from === 'user' ? styles.userBubble : styles.botBubble]}>
        <Text style={item.from === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Mall of Sousse</Text>
        <Text style={styles.heroSub}>Customer Service</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />

      <View style={styles.footer}> 
        <Text style={styles.hintText}>{listening ? 'Listening...' : 'Tap and speak to the assistant'}</Text>

        <TouchableOpacity activeOpacity={0.8} onPress={onMicPress} style={styles.micWrap}>
          <Animated.View style={[styles.pulse, { transform: [{ scale: pulse }] }]} pointerEvents="none" />
          <View style={[styles.micButton, listening ? { backgroundColor: '#255bd6' } : {}]}>
            <Ionicons name="mic" size={32} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eaf3ff' },
  hero: { paddingTop: 24, paddingBottom: 14, alignItems: 'center', backgroundColor: 'transparent' },
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
  footer: { position: 'absolute', left: 0, right: 0, bottom: 28, alignItems: 'center' },
  hintText: { color: '#3b6fbf', marginBottom: 10, fontWeight: '600' },
  micWrap: { alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: '#255bd6', opacity: 0.12, bottom: -6 },
  micButton: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#3478f6', alignItems: 'center', justifyContent: 'center', elevation: 6 },
});

export default VoiceScreen;
