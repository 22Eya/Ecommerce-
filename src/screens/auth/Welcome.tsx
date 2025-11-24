import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import IMAGES from '../../../assets/images';

type Props = StackScreenProps<RootStackParamList, 'SignIn'>;

const Welcome: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={{ uri: IMAGES.hero }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome To MALL GUIDE</Text>
        <Text style={styles.subtitle}>Explore the best malls in town — discover deals & more.</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: {
    height: 420,
    justifyContent: 'center',
  },
  heroImage: { borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  overlay: { flex: 1, backgroundColor: 'rgba(52,120,246,0.12)', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  card: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#666', textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: '#3478f6', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default Welcome;
