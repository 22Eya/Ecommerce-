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
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type Props = StackScreenProps<RootStackParamList, 'ForgetPass'>;

const ForgetPass: React.FC<Props> = ({ navigation }) => {
	const [email, setEmail] = useState('');

	const onSubmit = () => {
		if (!email) {
			Alert.alert('Erreur', 'Veuillez entrer votre email.');
			return;
		}
		// Navigate to the memory game (Voucher) to perform the 1-minute challenge for reset
		(navigation as any).navigate('Main', { screen: 'Voucher', params: { fromReset: true, email } });
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<View style={styles.header} />

			<View style={styles.card}>
				<Text style={styles.title}>Mot de passe oublié</Text>

				<Text style={styles.info}>Entrez l'email associé à votre compte. Nous enverrons un lien pour réinitialiser votre mot de passe.</Text>

				<TextInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} />

				<TouchableOpacity style={styles.button} onPress={onSubmit}>
					<Text style={styles.buttonText}>Envoyer</Text>
				</TouchableOpacity>
			</View>
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
	card: { flex: 1, marginTop: -70, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 3 },
	title: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
	info: { color: '#666', textAlign: 'center', marginBottom: 20 },
	input: { height: 48, borderColor: '#eee', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12 },
	button: { height: 48, backgroundColor: '#3478f6', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
	buttonText: { color: '#fff', fontWeight: '600' },
});

export default ForgetPass;
