import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    Pressable,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.floor((width - 80) / 3);

type Tile = {
    id: number;
    emoji: string;
    revealed: boolean;
    matched: boolean;
};

const EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒'];

function shuffle<T>(arr: T[]) {
    return arr
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
}

const Voucher: React.FC = () => {
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [selection, setSelection] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(0.8));
    const flipAnims = useRef<Record<number, Animated.Value>>({}).current;
    const [bestMoves, setBestMoves] = useState<number | null>(null);
    const [confetti, setConfetti] = useState<Array<{ id: number; x: number; anim: Animated.Value }>>([]);
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [endReason, setEndReason] = useState<'win' | 'timeout' | null>(null);
    const navigation = useNavigation();
    const route: any = useRoute();
    const fromReset = route?.params?.fromReset;

    useEffect(() => {
        resetBoard();
    }, []);

    useEffect(() => {
        if (modalVisible) {
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true });
        } else {
            scaleAnim.setValue(0.8);
        }
    }, [modalVisible]);

    const resetBoard = () => {
        const pairList = [...EMOJIS, ...EMOJIS];
        const shuffled = shuffle(pairList);
        const list: Tile[] = shuffled.map((emoji, i) => ({ id: i, emoji, revealed: false, matched: false }));
        // init flip animated values
        list.forEach((t) => {
            flipAnims[t.id] = new Animated.Value(0);
        });
        setTiles(list);
        setSelection([]);
        setMoves(0);
        setModalVisible(false);
        setConfetti([]);
        setSecondsLeft(60);
        setEndReason(null);
    };

    const onPressTile = (id: number) => {
        if (selection.length === 2) return;
        if (tiles.find((t) => t.id === id)?.revealed) return;

        // animate flip to 1
        Animated.timing(flipAnims[id], { toValue: 1, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start();

        setTiles((prev) => prev.map((t) => (t.id === id ? { ...t, revealed: true } : t)));
        setSelection((s) => [...s, id]);
    };

    // handle when two selected
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (selection.length === 2) {
            const [a, b] = selection;
            setMoves((m) => m + 1);
            const tileA = tiles.find((t) => t.id === a);
            const tileB = tiles.find((t) => t.id === b);

            if (tileA && tileB && tileA.emoji === tileB.emoji) {
                setTiles((prev) => prev.map((t) => (t.id === a || t.id === b ? { ...t, matched: true } : t)));
                setSelection([]);
                // check win after a short delay to allow animation
                timer = setTimeout(() => {
                    if (tiles.every((t) => t.matched || t.id === a || t.id === b)) {
                        handleWin();
                    }
                }, 300);
            } else {
                // not match: flip back after delay
                timer = setTimeout(() => {
                    // animate flip back
                    [a, b].forEach((id) => {
                        Animated.timing(flipAnims[id], { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start();
                    });
                    setTiles((prev) => prev.map((t) => (t.id === a || t.id === b ? { ...t, revealed: false } : t)));
                    setSelection([]);
                }, 700);
            }
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [selection]);

    const handleWin = async () => {
        setEndReason('win');
        setModalVisible(true);
        // save best moves
        try {
            const raw = await AsyncStorage.getItem('@best_moves');
            const currentBest = raw ? parseInt(raw, 10) : null;
            if (currentBest === null || moves < currentBest) {
                await AsyncStorage.setItem('@best_moves', String(moves));
                setBestMoves(moves);
            } else {
                setBestMoves(currentBest);
            }
        } catch (e) {
            // ignore storage errors
        }

        // create simple confetti particles
        const parts = Array.from({ length: 12 }).map((_, i) => ({ id: i, x: Math.random() * (width - 40) + 20, anim: new Animated.Value(0) }));
        setConfetti(parts);
        parts.forEach((p, i) => {
            Animated.timing(p.anim, { toValue: 1, duration: 1200 + Math.random() * 800, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start();
        });
    };

    useEffect(() => {
        // load best moves
        (async () => {
            try {
                const raw = await AsyncStorage.getItem('@best_moves');
                if (raw) setBestMoves(parseInt(raw, 10));
            } catch (e) {}
        })();

        // countdown timer
        const interval = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    clearInterval(interval);
                    // time out
                    if (!tiles.every((t) => t.matched)) {
                        setEndReason('timeout');
                        setModalVisible(true);
                    }
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const renderTile = ({ item }: { item: Tile }) => {
        const anim = flipAnims[item.id] || new Animated.Value(0);
        const rotateY = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
        const frontOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
        const backOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

        return (
            <TouchableOpacity activeOpacity={0.9} style={styles.cardWrap} onPress={() => !item.revealed && !item.matched && onPressTile(item.id)}>
                <Animated.View style={[styles.card, (item.revealed || item.matched) && styles.cardRevealed, { transform: [{ rotateY }] }] as any}>
                    <Animated.Text style={[styles.cardText, { opacity: frontOpacity }]}>{'?'}</Animated.Text>
                    <Animated.Text style={[styles.cardText, styles.cardFrontText, { position: 'absolute', opacity: backOpacity }]}>{item.emoji}</Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header} />

            <View style={styles.content}>
                <Text style={styles.title}>Memory Game</Text>
                <Text style={styles.subtitle}>Match pairs to win a voucher</Text>

                <FlatList data={tiles} keyExtractor={(t) => String(t.id)} renderItem={renderTile} numColumns={3} contentContainerStyle={styles.grid} scrollEnabled={false} />

                <View style={styles.controls}>
                    <Text style={{ color: '#666', marginBottom: 6 }}>Time left: {secondsLeft}s</Text>
                    <Text style={{ color: '#666', marginBottom: 8 }}>Moves: {moves} {bestMoves !== null ? `(Best: ${bestMoves})` : ''}</Text>
                    <TouchableOpacity style={styles.actionBtn} onPress={resetBoard}>
                        <Text style={styles.actionText}>Restart</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.winEmoji}>🏆</Text>
                        {endReason === 'win' ? (
                            <>
                                <Text style={styles.winTitle}>{fromReset ? 'You win 10% sale' : 'Thanks — you have 10% discount'}</Text>
                                <Text style={styles.winSub}>Code: MALL10 — Use at checkout.</Text>
                                <Text style={{ color: '#666', marginBottom: 8 }}>Moves: {moves} {bestMoves !== null ? `(Best: ${bestMoves})` : ''}</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.winTitle}>{fromReset ? "It's okay, see you tomorrow." : "Time's up"}</Text>
                                <Text style={styles.winSub}>{fromReset ? '' : 'Better luck next time — explore the app!'}</Text>
                            </>
                        )}

                        <Pressable style={styles.thanksBtn} onPress={() => {
                            setModalVisible(false);
                            // after closing, navigate to Home tab
                            (navigation as any).navigate('Home');
                        }}>
                            <Text style={styles.thanksText}>Continue</Text>
                        </Pressable>
                    </Animated.View>

                    {/* confetti particles */}
                    {confetti.map((p) => {
                        const translateY = p.anim.interpolate({ inputRange: [0, 1], outputRange: [-10, 500] });
                        const rotate = p.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
                        const opacity = p.anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0.9, 0] });
                        return (
                            <Animated.Text key={p.id} style={[styles.confetti, { left: p.x, transform: [{ translateY }, { rotate }], opacity }]}>
                                🎉
                            </Animated.Text>
                        );
                    })}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { height: 140, backgroundColor: '#3478f6', borderBottomLeftRadius: 200, borderBottomRightRadius: 200 },
    content: { flex: 1, marginTop: -70, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 3 },
    title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
    subtitle: { textAlign: 'center', color: '#666', marginBottom: 12 },
    grid: { alignItems: 'center', justifyContent: 'center' },
    cardWrap: { margin: 8 },
    card: { width: CARD_SIZE, height: CARD_SIZE, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, backfaceVisibility: 'hidden' as any },
    cardRevealed: { backgroundColor: '#f8fbff', borderColor: '#dfefff' },
    cardText: { fontSize: 28 },
    cardFrontText: { fontSize: 28 },
    confetti: { position: 'absolute', top: 0, fontSize: 20 },
    controls: { marginTop: 12, alignItems: 'center' },
    actionBtn: { backgroundColor: '#3478f6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
    actionText: { color: '#fff', fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: 300, backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
    winEmoji: { fontSize: 48, marginBottom: 8 },
    winTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
    winSub: { color: '#666', marginBottom: 14, textAlign: 'center' },
    thanksBtn: { backgroundColor: '#3478f6', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
    thanksText: { color: '#fff', fontWeight: '600' },
});

export default Voucher;

