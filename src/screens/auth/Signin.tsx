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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

type Props = StackScreenProps<RootStackParamList, 'SignIn'>;

const Signin: React.FC<Props> = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onSubmit = () => {
		if (!email || !password) {
			Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
			return;
		}
		// simulate auth
		// On successful sign-in, credit daily login bonus (+0.5) if not already credited today
		(async () => {
			try {
				const rawPoints = await AsyncStorage.getItem('@points');
				let points = rawPoints ? parseFloat(rawPoints) : 0;
				const last = await AsyncStorage.getItem('@points_last_date');
				const today = new Date().toISOString().slice(0, 10);
				if (last !== today) {
					points = Math.round((points + 0.5) * 100) / 100;
					await AsyncStorage.setItem('@points', String(points));
					await AsyncStorage.setItem('@points_last_date', today);
				}
			} catch (e) {
				// ignore storage errors
			}
			// Navigate to main app
			navigation.replace('Main', { screen: 'Voucher' });
		})();
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View style={styles.header} />

			<View style={styles.card}>
				<Text style={styles.title}>Welcome Back!</Text>

				<TextInput
					placeholder="Email"
					keyboardType="email-address"
					autoCapitalize="none"
					value={email}
					onChangeText={setEmail}
					style={styles.input}
				/>

				<TextInput
					placeholder="Mot de passe"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					style={styles.input}
				/>

				<TouchableOpacity onPress={() => navigation.navigate('ForgetPass')}>
					<Text style={styles.link}>Mot de passe oublié ?</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button} onPress={onSubmit}>
					<Text style={styles.buttonText}>Se connecter</Text>
				</TouchableOpacity>

				<Text style={styles.or}>— Ou se connecter avec —</Text>

				<View style={styles.socialRow}>
					<TouchableOpacity style={styles.socialBtn}>
						<FontAwesome name="facebook" size={20} color="#1877F2" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialBtn}>
						<AntDesign name="google" size={20} color="#DB4437" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.socialBtn}>
						<AntDesign name="twitter" size={20} color="#1DA1F2" />
					</TouchableOpacity>
				</View>

				<View style={styles.row}>
					<Text>Pas de compte ?</Text>
					<TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
						<Text style={[styles.link, { marginLeft: 8 }]}>Créer un compte</Text>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	header: {
		height: 160,
		backgroundColor: '#3478f6',
		borderBottomLeftRadius: 200,
		borderBottomRightRadius: 200,
	},
	card: {
		flex: 1,
		marginTop: -80,
		marginHorizontal: 20,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 20,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 4,
	},
	title: { fontSize: 22, fontWeight: '700', marginBottom: 18, textAlign: 'center' },
	input: { height: 48, borderColor: '#eee', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12 },
	button: { height: 48, backgroundColor: '#3478f6', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
	buttonText: { color: '#fff', fontWeight: '600' },
	link: { color: '#3478f6', marginTop: 8, textAlign: 'right' },
	row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
	or: { textAlign: 'center', color: '#888', marginTop: 12, marginBottom: 8 },
	socialRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 40, marginTop: 6 },
	socialBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
});

export default Signin;
