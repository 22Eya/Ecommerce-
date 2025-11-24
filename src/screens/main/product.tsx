import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RouteParams = {
	product?: { id: string; title: string; price: string; image: string };
};

const Product: React.FC = () => {
	const route = useRoute();
	const navigation: any = useNavigation();
	const { product } = (route.params || {}) as RouteParams;
	const [qty, setQty] = useState<number>(1);

	useEffect(() => {
		// ensure qty >=1
		if (qty < 1) setQty(1);
	}, [qty]);

	const addToCart = async () => {
		if (!product) return;
		try {
			const raw = await AsyncStorage.getItem('@cart');
			const cart = raw ? JSON.parse(raw) : [];
			const existing = cart.find((c: any) => c.id === product.id);
			if (existing) {
				existing.qty = existing.qty + qty;
			} else {
				cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, qty });
			}
			await AsyncStorage.setItem('@cart', JSON.stringify(cart));
			Alert.alert('Panier', 'Ajouté au panier');
			navigation.navigate('Cart');
		} catch (e) {
			Alert.alert('Erreur', 'Impossible d\'ajouter au panier');
		}
	};

	if (!product) return (
		<SafeAreaView style={styles.container}><Text style={styles.text}>Produit introuvable</Text></SafeAreaView>
	);

	return (
		<SafeAreaView style={styles.container}>
			<Image source={{ uri: product.image }} style={styles.image as any} />
			<View style={styles.card}>
				<Text style={styles.title}>{product.title}</Text>
				<Text style={styles.price}>{product.price}</Text>
				<Text style={styles.desc}>A nice item from the store. Add a description here.</Text>

				<View style={styles.qtyRow}>
					<TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}><Text style={styles.qtyTxt}>-</Text></TouchableOpacity>
					<Text style={styles.qtyVal}>{qty}</Text>
					<TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => q + 1)}><Text style={styles.qtyTxt}>+</Text></TouchableOpacity>
				</View>

				<TouchableOpacity style={styles.addBtn} onPress={addToCart}>
					<Text style={styles.addTxt}>Add to cart</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	image: { width: '100%', height: 260, resizeMode: 'cover' },
	card: { padding: 16 },
	title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
	price: { color: '#255bd6', fontSize: 20, fontWeight: '800', marginBottom: 8 },
	desc: { color: '#666', marginBottom: 12 },
	qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
	qtyBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#f4f6fb', alignItems: 'center', justifyContent: 'center' },
	qtyTxt: { fontSize: 18, fontWeight: '700' },
	qtyVal: { marginHorizontal: 12, fontSize: 16, fontWeight: '700' },
	addBtn: { marginTop: 16, backgroundColor: '#255bd6', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
	addTxt: { color: '#fff', fontWeight: '800' },
	text: { textAlign: 'center' }
});

export default Product;
