import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Alert,
	ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { FontAwesome } from '@expo/vector-icons';

type Props = StackScreenProps<RootStackParamList, 'SignUp'>;

const Signup: React.FC<Props> = ({ navigation }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');

	const onSubmit = () => {
		if (!name || !email || !password || !confirm) {
			Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
			return;
		}
		if (password !== confirm) {
			Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
			return;
		}
		// simulate signup and reward +2 points
		(async () => {
			try {
				const rawPoints = await AsyncStorage.getItem('@points');
				let points = rawPoints ? parseFloat(rawPoints) : 0;
				points = Math.round((points + 2) * 100) / 100;
				await AsyncStorage.setItem('@points', String(points));
			} catch (e) {}
			Alert.alert('Succès', 'Inscription simulée — vous avez reçu +2 points.');
			navigation.navigate('SignIn');
		})();
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View style={styles.header} />

			<ScrollView contentContainerStyle={styles.card} keyboardShouldPersistTaps="handled">
				<Text style={styles.title}>Create account</Text>

				<TextInput placeholder="Nom complet" value={name} onChangeText={setName} style={styles.input} />
				<TextInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} />
				<TextInput placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
				<TextInput placeholder="Confirmer mot de passe" secureTextEntry value={confirm} onChangeText={setConfirm} style={styles.input} />

				<TouchableOpacity style={styles.button} onPress={onSubmit}>
					<Text style={styles.buttonText}>S'inscrire</Text>
				</TouchableOpacity>

				<Text style={styles.or}>— Ou —</Text>
				<View style={styles.socialRow}>
					<TouchableOpacity style={styles.socialBtn}>
						<FontAwesome name="google" size={20} color="#DB4437" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialBtn}>
						<FontAwesome name="facebook" size={20} color="#1877F2" />
					</TouchableOpacity>
				</View>

				<View style={styles.row}>
					<Text>Vous avez déjà un compte ?</Text>
					<TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
						<Text style={[styles.link, { marginLeft: 8 }]}>Se connecter</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	header: {
		height: 140,
		backgroundColor: '#3478f6',
		borderBottomLeftRadius: 200,
		borderBottomRightRadius: 200,
	},
	card: { padding: 20, marginTop: -70, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 16, elevation: 3 },
	title: { fontSize: 22, fontWeight: '700', marginBottom: 18, textAlign: 'center' },
	input: { height: 48, borderColor: '#eee', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12 },
	button: { height: 48, backgroundColor: '#3478f6', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
	buttonText: { color: '#fff', fontWeight: '600' },
	link: { color: '#3478f6' },
	row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
	or: { textAlign: 'center', color: '#888', marginTop: 12 },
	socialRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 40, marginTop: 8 },
	socialBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
});

export default Signup;
