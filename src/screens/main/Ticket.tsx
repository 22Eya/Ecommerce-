import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';

const Ticket: React.FC = () => {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const { id, qrValue, amount } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Your Digital Ticket</Text>
        <Text style={styles.sub}>Order ID: {id}</Text>
        <View style={{ marginVertical: 18, alignItems: 'center' }}>
          {qrValue ? <QRCode value={qrValue} size={200} /> : <Text>No QR</Text>}
        </View>
        <Text style={styles.amount}>Amount: ${amount?.toFixed ? amount.toFixed(2) : amount}</Text>

        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Text style={styles.doneTxt}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  card: { margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 2, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  sub: { color: '#666', marginTop: 6 },
  amount: { marginTop: 8, fontWeight: '700', color: '#255bd6' },
  doneBtn: { marginTop: 20, backgroundColor: '#255bd6', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10 },
  doneTxt: { color: '#fff', fontWeight: '800' }
});

export default Ticket;
