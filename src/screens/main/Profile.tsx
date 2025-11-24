import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IMAGES from '../../../assets/images';
import VoiceScreen from '../voice/VoiceScreen';

const Profile: React.FC = () => {
	const route: any = useRoute();
	const navigation = useNavigation();
	const openParam: string | undefined = route?.params?.open;
	const [showVoiceModal, setShowVoiceModal] = useState(false);
	const [highlightMedal, setHighlightMedal] = useState(false);
	const [points, setPoints] = useState<number>(0);
	const POINTS_GOAL = 1000; // for progress bar calculation

	useEffect(() => {
		if (openParam === 'voice' || openParam === 'both') {
			// show voice modal shortly after arriving to give sense of transition
			setTimeout(() => setShowVoiceModal(true), 300);
		}
		if (openParam === 'achievements' || openParam === 'both') {
			// highlight the medal briefly
			setHighlightMedal(true);
			setTimeout(() => setHighlightMedal(false), 1400);
		}
	}, [openParam]);

	useEffect(() => {
		(async () => {
			try {
				const raw = await AsyncStorage.getItem('@points');
				if (raw) setPoints(parseFloat(raw));
			} catch (e) {}
		})();
	}, []);
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.rowTop}>
					<View style={styles.avatarWrap}>
						<Image source={{ uri: IMAGES.prize1 }} style={styles.avatar} />
						<View style={styles.medal}>
							<Text style={styles.medalText}>1</Text>
						</View>
					</View>

					<View style={styles.userInfo}>
						<Text style={styles.name}>Achiel</Text>
						<Text style={styles.sub}>VIP • Level 4</Text>

						<View style={styles.progressRow}>
							<View style={styles.progressBarBg}>
								<View style={[styles.progressBarFill, { width: `${Math.min(100, (points / POINTS_GOAL) * 100)}%` }]} />
							</View>
							<Text style={styles.progressText}>{Math.min(100, Math.round((points / POINTS_GOAL) * 100))}%</Text>
						</View>
					</View>
				</View>

				<View style={styles.balanceRow}>
					<View style={styles.balanceCard}>
						<Text style={styles.balanceLabel}>Points</Text>
						<Text style={styles.balanceValue}>{points}</Text>
					</View>
					<View style={styles.balanceCard}>
						<Text style={styles.balanceLabel}>Orders</Text>
						<Text style={styles.balanceValue}>24</Text>
					</View>
					<View style={styles.balanceCard}>
						<Text style={styles.balanceLabel}>Level</Text>
						<Text style={styles.balanceValue}>4</Text>
					</View>
				</View>
			</View>

			<View style={styles.actions}> 
				<Text style={styles.sectionTitle}>Quick Actions</Text>
				<View style={styles.actionsRow}>
					<TouchableOpacity style={styles.actionBtn}>
						<Text style={styles.actionText}>My Orders</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.actionBtn}>
						<Text style={styles.actionText}>Favorites</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.actionBtn}>
						<Text style={styles.actionText}>Settings</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.footerInfo}>
				<Text style={styles.smallTitle}>Mall Assistant</Text>
				<Text style={styles.smallText}>Use the voice assistant to get help with orders, store locations and offers.</Text>
			</View>

			{/* Achievements section placed after header but visually high */}
			<View style={styles.achievementsWrap}>
				<Text style={styles.sectionTitle}>Achievements</Text>
				<View style={styles.achRow}>
					<View style={[styles.achCard, highlightMedal ? styles.achHighlight : null]}>
						<Text style={styles.achTitle}>Top Shopper</Text>
						<Text style={styles.achSub}>Reached 1000 points</Text>
					</View>
					<View style={styles.achCard}>
						<Text style={styles.achTitle}>First Purchase</Text>
						<Text style={styles.achSub}>Order #001 completed</Text>
					</View>
					<View style={styles.achCard}>
						<Text style={styles.achTitle}>Ticket Hunter</Text>
						<Text style={styles.achSub}>Won 3 hunts</Text>
					</View>
				</View>
			</View>

			<Modal visible={showVoiceModal} animationType="slide" onRequestClose={() => setShowVoiceModal(false)}>
				<SafeAreaView style={{ flex: 1 }}>
					<TouchableOpacity style={{ padding: 12 }} onPress={() => setShowVoiceModal(false)}>
						<Text style={{ color: '#255bd6', fontWeight: '700' }}>Close Assistant</Text>
					</TouchableOpacity>
					<VoiceScreen />
				</SafeAreaView>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f6f7fb' },
	header: { backgroundColor: '#fff', paddingBottom: 12, borderBottomWidth: 1, borderColor: '#eee' },
	rowTop: { flexDirection: 'row', alignItems: 'center', padding: 16 },
	avatarWrap: { width: 86, height: 86, borderRadius: 44, overflow: 'hidden', marginRight: 12 },
	avatar: { width: '100%', height: '100%' },
	medal: { position: 'absolute', right: -6, top: -6, backgroundColor: '#ffd43b', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 3 },
	medalText: { fontWeight: '700', color: '#fff' },
	userInfo: { flex: 1 },
	name: { fontSize: 18, fontWeight: '800', color: '#222' },
	sub: { color: '#777', marginTop: 4 },
	progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
	progressBarBg: { flex: 1, height: 8, backgroundColor: '#eef3ff', borderRadius: 10, marginRight: 8, overflow: 'hidden' },
	progressBarFill: { height: '100%', backgroundColor: '#255bd6' },
	progressText: { color: '#255bd6', fontWeight: '700' },
	balanceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8 },
	balanceCard: { flex: 1, backgroundColor: '#fff', marginHorizontal: 6, padding: 12, borderRadius: 8, alignItems: 'center', elevation: 2 },
	balanceLabel: { color: '#777', fontSize: 12 },
	balanceValue: { fontWeight: '800', fontSize: 16, marginTop: 6 },
	actions: { padding: 16 },
	sectionTitle: { fontWeight: '800', fontSize: 15, marginBottom: 10 },
	actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
	actionBtn: { flex: 1, backgroundColor: '#fff', marginHorizontal: 6, padding: 12, borderRadius: 10, alignItems: 'center', elevation: 2 },
	actionText: { color: '#255bd6', fontWeight: '700' },
	footerInfo: { paddingHorizontal: 16, marginTop: 12 },
	smallTitle: { fontWeight: '700', color: '#255bd6' },
	smallText: { color: '#666', marginTop: 6 }
	,
	achievementsWrap: { paddingHorizontal: 16, marginTop: 12 },
	achRow: { flexDirection: 'row', justifyContent: 'space-between' },
	achCard: { flex: 1, backgroundColor: '#fff', marginHorizontal: 6, padding: 12, borderRadius: 10, alignItems: 'center', elevation: 2 },
	achTitle: { fontWeight: '800', color: '#222' },
	achSub: { color: '#777', marginTop: 6, fontSize: 12 },
	achHighlight: { borderWidth: 2, borderColor: '#ffd43b' }
});

export default Profile;
