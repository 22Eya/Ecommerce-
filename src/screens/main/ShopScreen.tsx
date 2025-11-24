import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import IMAGES from '../../../assets/images';
import { CHALLENGE_SHOP, CHALLENGE_MESSAGE } from '../../constants/challenge';

type Props = StackScreenProps<RootStackParamList, 'Shop'>;

const SHOP_PRODUCTS: { [key: string]: Array<{ id: string; title: string; price: string; image: string }> } = {
  zara: [
    { id: 'z1', title: 'Zara Jacket', price: '$79', image: IMAGES.prize1 },
    { id: 'z2', title: 'Zara Dress', price: '$59', image: IMAGES.prize2 },
    { id: 'z3', title: 'Zara Bag', price: '$39', image: IMAGES.prize3 },
  ],
  hm: [
    { id: 'h1', title: 'H&M Shirt', price: '$29', image: IMAGES.prize2 },
  ],
  lcw: [
    { id: 'l1', title: 'LCW Sneaker', price: '$49', image: IMAGES.prize3 },
  ],
  nike: [
    { id: 'n1', title: 'Nike Shoes', price: '$99', image: IMAGES.prize2 },
  ],
};

const Shop: React.FC<Props> = ({ route, navigation }) => {
  const { shopId } = route.params || { shopId: 'zara' };

  const products = useMemo(() => SHOP_PRODUCTS[shopId] || [], [shopId]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: IMAGES.prize1 }} style={styles.headerImage as any} />
        <View style={styles.headerOverlay}>
          <Text style={styles.shopTitle}>{shopId?.toUpperCase()}</Text>
          <Text style={styles.challenge}>{CHALLENGE_MESSAGE} {shopId?.toUpperCase()} — hurry up!</Text>
          {/* show Start Hunt when this shop hosts the challenge */}
          {shopId === CHALLENGE_SHOP && (
            <TouchableOpacity style={{ marginTop: 10, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }} onPress={() => (navigation as any).navigate('Main', { screen: 'Voucher' })}>
              <Text style={{ fontWeight: '700' }}>Start Ticket Hunt</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: '700', marginBottom: 6 }}>Location</Text>
        <Text style={{ color: '#666' }}>Level 2, East Wing, Mall Center — Near Entrance B</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {['Clothing', 'Shoes', 'Accessories', 'Sale'].map((c) => (
            <TouchableOpacity key={c} style={styles.catBtn}>
              <Text>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products</Text>
        <FlatList data={products} keyExtractor={(p) => p.id} horizontal showsHorizontalScrollIndicator={false} renderItem={({ item }) => (
          <View style={styles.prodCard}>
            <Image source={{ uri: item.image }} style={styles.prodImage as any} />
            <Text style={styles.prodTitle}>{item.title}</Text>
            <Text style={styles.prodPrice}>{item.price}</Text>
          </View>
        )} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 200, backgroundColor: '#eee' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerOverlay: { position: 'absolute', left: 12, top: 12 },
  shopTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  challenge: { color: '#fff', marginTop: 6 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  catBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 8, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  prodCard: { width: 160, marginRight: 12, backgroundColor: '#fff', borderRadius: 8, padding: 8, elevation: 2 },
  prodImage: { width: '100%', height: 100, borderRadius: 8 },
  prodTitle: { marginTop: 8, fontWeight: '700' },
  prodPrice: { color: '#3478f6', marginTop: 6, fontWeight: '700' },
});

export default Shop;
