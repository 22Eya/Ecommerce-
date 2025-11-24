import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Payment: React.FC = () => {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const amount: number = route?.params?.amount ?? 0;

  const handlePay = () => {
    // simulate payment success: create ticket and clear cart
    (async () => {
      try {
        const ticketId = `TICKET-${Date.now()}`;
        const qrValue = JSON.stringify({ id: ticketId, amount, items: route?.params?.items || [] });
        await AsyncStorage.removeItem('@cart');
        Alert.alert('Payment', `Paid ${amount} successfully`, [
          { text: 'OK', onPress: () => navigation.navigate('Ticket', { id: ticketId, qrValue, amount }) }
        ]);
      } catch (e) {
        Alert.alert('Erreur', 'Impossible de traiter le paiement.');
      }
    })();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Amount to pay</Text>
        <Text style={styles.amount}>${amount}</Text>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Payment method</Text>
          <View style={styles.method}> 
            <Text>Card •••• 4242</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
          <Text style={styles.payText}>Pay now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  card: { margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 2 },
  title: { fontSize: 20, fontWeight: '800', color: '#222' },
  subtitle: { color: '#666', marginTop: 8 },
  amount: { fontSize: 28, fontWeight: '900', color: '#255bd6', marginTop: 6 },
  label: { color: '#666' },
  method: { marginTop: 8, padding: 12, backgroundColor: '#fafafa', borderRadius: 8 },
  payBtn: { marginTop: 24, backgroundColor: '#255bd6', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  payText: { color: '#fff', fontWeight: '800' }
});

export default Payment;
