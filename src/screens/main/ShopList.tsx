import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import IMAGES from '../../../assets/images';
import { CHALLENGE_SHOP } from '../../constants/challenge';

type Props = StackScreenProps<RootStackParamList, 'ShopList'>;

const SHOPS = [
  { id: 'zara', name: 'ZARA', img: IMAGES.prize1 },
  { id: 'hm', name: 'H&M', img: IMAGES.prize2 },
  { id: 'lcw', name: 'LCW', img: IMAGES.prize3 },
  { id: 'nike', name: 'Nike', img: IMAGES.prize2 },
];

const ShopList: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Shops</Text>
      <FlatList
        data={SHOPS}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Shop', { shopId: item.id })}>
            <Image source={{ uri: item.img }} style={styles.img as any} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.name}>{item.name}</Text>
              {item.id === CHALLENGE_SHOP && (
                <View style={styles.badge}>
                  <Text style={{ color: '#fff', fontSize: 11 }}>HUNT</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#fff', marginBottom: 8, elevation: 2 },
  img: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  badge: { backgroundColor: '#e53935', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
});

export default ShopList;
