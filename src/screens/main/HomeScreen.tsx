import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import IMAGES from '../../../assets/images';
import { CHALLENGE_SHOP } from '../../constants/challenge';

const SHOPS = [
	{ id: 'zara', name: 'ZARA' },
	{ id: 'hm', name: 'H&M' },
	{ id: 'lcw', name: 'LCW' },
	{ id: 'nike', name: 'Nike' },
];

const CATEGORIES = {
	zara: ['Clothing', 'Shoes', 'Bags', 'Accessories'],
	hm: ['New In', 'Dresses', 'Basics', 'Sale'],
	lcw: ['Men', 'Women', 'Kids', 'Gifts'],
	nike: ['Sportswear', 'Shoes', 'Accessories', 'Sale'],
};

const PRODUCTS = Array.from({ length: 8 }).map((_, i) => ({
	id: `prod-${i}`,
	title: ['Jacket', 'Shirt', 'Dress', 'Bag', 'Sneaker', 'Hat', 'Watch', 'Skirt'][i % 8],
	price: ['$79', '$49', '$59', '$39', '$99', '$19', '$149', '$45'][i % 8],
	image: IMAGES.prize1,
}));

const HomeScreen: React.FC = () => {
	const navigation = useNavigation();
	const [selectedShop, setSelectedShop] = useState<string>(SHOPS[0].id);
	const [query, setQuery] = useState('');

	return (
		<SafeAreaView style={styles.container}>
			{/* Header with curved blue background */}
			<View style={styles.headerWrap}>
				<View style={styles.headerCurve} />
				<View style={styles.headerContent}>
					<View style={styles.headerTop}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TouchableOpacity
								style={styles.menuButton}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								onPress={() => (navigation as any).navigate('ShopList')}
							>
								<FontAwesome name="bars" size={22} color="#fff" />
								{CHALLENGE_SHOP && <View style={styles.menuDot} />}
							</TouchableOpacity>
							<Text style={styles.appTitle}>MALL GUIDE</Text>
						</View>

						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TouchableOpacity style={{ marginRight: 14 }}>
								<MaterialIcons name="notifications-none" size={20} color="#fff" />
							</TouchableOpacity>
							<TouchableOpacity>
								<Entypo name="shopping-bag" size={20} color="#fff" />
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.searchRow}>
						<TextInput
							placeholder="Search"
							placeholderTextColor="#999"
							value={query}
							onChangeText={setQuery}
							style={styles.searchInput}
						/>
						<TouchableOpacity style={styles.searchBtn} onPress={() => { /* optionally trigger search */ }}>
							<FontAwesome name="search" size={18} color="#fff" />
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<ScrollView style={styles.body}>
				{/* Flash Sale banner */}
				<View style={styles.flashBanner}>
					<View style={styles.flashTextCol}>
						<Text style={styles.flashSmall}>Flash Sale</Text>
						<Text style={styles.flashBig}>Up to 50% OFF</Text>
						<TouchableOpacity style={styles.flashBtn} onPress={() => {}}>
							<Text style={{ color: '#fff', fontWeight: '700' }}>Shop now</Text>
						</TouchableOpacity>
					</View>
					<Image source={{ uri: IMAGES.prize2 }} style={styles.flashImage as any} />
				</View>

				{/* Big Sale horizontal banner */}
				<View style={styles.bigSaleCard}>
					<Text style={{ fontWeight: '700', color: '#fff', fontSize: 16 }}>Big Sale</Text>
					<Text style={{ color: '#fff', marginTop: 6 }}>Limited time offers</Text>
					<Image source={{ uri: IMAGES.prize3 }} style={styles.bigSaleImage as any} />
				</View>

				{/* Product grid */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Just For You</Text>
						<TouchableOpacity>
							<Text style={{ color: '#3478f6' }}>See all</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.grid}>
						{PRODUCTS.map((p) => (
							<TouchableOpacity key={p.id} style={styles.prodCard} onPress={() => (navigation as any).navigate('Product', { product: p })}>
								<Image source={{ uri: p.image }} style={styles.prodImage as any} />
								<Text numberOfLines={1} style={styles.prodTitle}>{p.title}</Text>
								<View style={styles.prodRow}>
									<Text style={styles.prodPrice}>{p.price}</Text>
									<TouchableOpacity onPress={() => (navigation as any).navigate('Profile', { open: 'both' })} style={{ flexDirection: 'row', alignItems: 'center' }}>
										<FontAwesome name="star" size={12} color="#f5b50a" />
										<Text style={{ marginLeft: 4, fontSize: 12, color: '#666' }}>4.5</Text>
									</TouchableOpacity>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Top Products (small circular avatars) */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Top Products</Text>
					<FlatList horizontal showsHorizontalScrollIndicator={false} data={PRODUCTS.slice(0,6)} keyExtractor={(i) => i.id} renderItem={({ item }) => (
						<View style={styles.topProdItem}>
							<Image source={{ uri: item.image }} style={styles.topProdImage as any} />
						</View>
					)} />
				</View>

				{/* ZARA large image */}
				<View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
					<Image source={{ uri: IMAGES.prize1 }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
				</View>

				{/* Categories & Shops */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Categories</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
						{CATEGORIES[selectedShop].map((c) => (
							<TouchableOpacity key={c} style={styles.catBtn}>
								<Text>{c}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				<View style={[styles.section, { paddingBottom: 80 }]}> {/* extra bottom padding */}
					<Text style={styles.sectionTitle}>Shops</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						{SHOPS.map((s) => (
							<TouchableOpacity key={s.id} style={styles.shopBlock} onPress={() => setSelectedShop(s.id)}>
								<Text style={{ fontWeight: '700' }}>{s.name}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	headerWrap: { height: 180, position: 'relative' },
	headerCurve: { position: 'absolute', left: 0, right: 0, top: 0, height: 160, backgroundColor: '#3478f6', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
	headerContent: { position: 'absolute', left: 16, right: 16, top: 18 },
	headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
	appTitle: { color: '#fff', fontWeight: '800', fontSize: 18 },


	body: { flex: 1 },
	flashBanner: { marginTop: 12, marginHorizontal: 16, height: 120, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', elevation: 3 },
	flashTextCol: { flex: 1, padding: 12 },
	flashSmall: { color: '#888', fontWeight: '700' },
	flashBig: { fontSize: 18, fontWeight: '800', marginTop: 6 },
	flashBtn: { marginTop: 10, backgroundColor: '#3478f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
	flashImage: { width: 120, height: 120, resizeMode: 'cover' },
	bigSaleCard: { marginHorizontal: 16, marginTop: 12, height: 100, borderRadius: 12, backgroundColor: '#255bd6', justifyContent: 'center', padding: 12, overflow: 'hidden' },
	bigSaleImage: { position: 'absolute', right: 0, width: 120, height: 100, opacity: 0.9 },
	section: { marginTop: 14 },
	sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
	sectionTitle: { fontSize: 16, fontWeight: '700', paddingHorizontal: 16 },
	grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8 },
	prodCard: { width: '48%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 12, padding: 8, elevation: 2 },
	prodImage: { width: '100%', height: 120, borderRadius: 8 },
	prodTitle: { marginTop: 8, fontSize: 13, fontWeight: '600' },
	prodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
	prodPrice: { color: '#3478f6', fontWeight: '700' },
	topProdItem: { marginHorizontal: 8, alignItems: 'center' },
	topProdImage: { width: 56, height: 56, borderRadius: 28 },
	catBtn: { backgroundColor: '#fff', padding: 8, marginRight: 8, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 8 },
	shopBlock: { flex: 1, backgroundColor: '#fff', marginHorizontal: 6, padding: 12, borderRadius: 8, alignItems: 'center', elevation: 2 },
	menuDot: { position: 'absolute', right: -2, top: -2, width: 10, height: 10, borderRadius: 6, backgroundColor: '#ff3b30' },
	menuButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
	searchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, position: 'relative' },
	searchInput: { flex: 1, backgroundColor: '#fff', borderRadius: 28, paddingHorizontal: 16, height: 50, paddingRight: 56 },
	searchBtn: { position: 'absolute', right: 0, top: 4, backgroundColor: '#255bd6', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

export default HomeScreen;
