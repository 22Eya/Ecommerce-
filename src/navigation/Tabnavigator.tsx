import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import Cart from '../screens/main/Cart';
import Voucher from '../screens/voucher/voucher';
import Profile from '../screens/main/Profile';
import VoiceScreen from '../screens/voice/VoiceScreen';
import { TabParamList } from '../types';

// create the navigator but cast to any to avoid strict TypeScript mismatch in this workspace
const TabAny: any = createBottomTabNavigator<TabParamList>();

const Tabnavigator: React.FC = () => {
  return (
    <TabAny.Navigator screenOptions={{ headerShown: false }}>
      <TabAny.Screen name="Home" component={HomeScreen} />
      <TabAny.Screen name="Cart" component={Cart} />
      <TabAny.Screen name="Voice" component={VoiceScreen} />
      <TabAny.Screen name="Voucher" component={Voucher} />
      <TabAny.Screen name="Profile" component={Profile} />
    </TabAny.Navigator>
  );
};

export default Tabnavigator;
