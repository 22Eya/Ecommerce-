import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart: React.FC = () => {
	const navigation: any = useNavigation();
	const isFocused = useIsFocused();
	const [items, setItems] = useState<Array<any>>([]);

	const loadCart = async () => {
		try {
			const raw = await AsyncStorage.getItem('@cart');
			const cart = raw ? JSON.parse(raw) : [];
			setItems(cart);
		} catch (e) {
			setItems([]);
		}
	};

	useEffect(() => { loadCart(); }, [isFocused]);

	const updateQty = async (id: string, qty: number) => {
		const updated = items.map(i => i.id === id ? { ...i, qty } : i).filter(i => i.qty > 0);
		setItems(updated);
		await AsyncStorage.setItem('@cart', JSON.stringify(updated));
	};

	const removeItem = async (id: string) => {
		const updated = items.filter(i => i.id !== id);
		setItems(updated);
		await AsyncStorage.setItem('@cart', JSON.stringify(updated));
	};

	const total = items.reduce((s, i) => s + (parseFloat(String(i.price).replace(/[^0-9.]/g, '')) * i.qty), 0);

	return (
		<View style={styles.container}>
			{items.length === 0 ? (
				<View style={{alignItems: 'center'}}>
					<Text style={styles.empty}>Votre panier est vide</Text>
				</View>
			) : (
				<FlatList data={items} keyExtractor={(i) => i.id} renderItem={({ item }) => (
					<View style={styles.row}>
						<Image source={{ uri: item.image }} style={styles.img as any} />
						<View style={{ flex: 1, marginLeft: 12 }}>
							<Text style={{ fontWeight: '700' }}>{item.title}</Text>
							<Text style={{ color: '#777', marginTop: 6 }}>{item.price} • qty {item.qty}</Text>
							<View style={{ flexDirection: 'row', marginTop: 8 }}>
								<TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, Math.max(1, item.qty - 1))}><Text>-</Text></TouchableOpacity>
								<TouchableOpacity style={[styles.qtyBtn, { marginLeft: 8 }]} onPress={() => updateQty(item.id, item.qty + 1)}><Text>+</Text></TouchableOpacity>
								<TouchableOpacity style={[styles.qtyBtn, { marginLeft: 8, backgroundColor: '#fee' }]} onPress={() => removeItem(item.id)}><Text>Remove</Text></TouchableOpacity>
							</View>
						</View>
					</View>
				)} />
			)}

			<View style={styles.footer}>
				<Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
				<TouchableOpacity style={styles.checkoutBtn} onPress={() => items.length ? navigation.navigate('Payment', { amount: total, items }) : Alert.alert('Panier vide', 'Ajoutez des articles avant de payer')}>
					<Text style={styles.checkoutText}>Proceed to Payment</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	empty: { marginTop: 40, color: '#666' },
	row: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#f0f0f0', alignItems: 'center' },
	img: { width: 64, height: 64, borderRadius: 8 },
	footer: { padding: 16, borderTopWidth: 1, borderColor: '#f0f0f0' },
	total: { fontSize: 18, fontWeight: '800', color: '#255bd6' },
	checkoutBtn: { marginTop: 12, backgroundColor: '#255bd6', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
	checkoutText: { color: '#fff', fontWeight: '800' },
	qtyBtn: { padding: 8, backgroundColor: '#f4f6fb', borderRadius: 8 }
});

export default Cart;
