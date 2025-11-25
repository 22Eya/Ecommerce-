import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signin from '../screens/auth/Signin';
import Signup from '../screens/auth/Signup';
import ForgetPass from '../screens/auth/ForgetPass';
import Welcome from '../screens/auth/Welcome';
import ShopList from '../screens/main/ShopList';
import Shop from '../screens/main/ShopScreen';
import Payment from '../screens/main/Payment';
import Product from '../screens/main/product';
import Ticket from '../screens/main/Ticket';
import Tabnavigator from './Tabnavigator';
import { RootStackParamList } from '../types';
import Cart from '../screens/main/Cart';

const Stack = createStackNavigator<RootStackParamList,string>();

const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator id="root" screenOptions={{ headerShown: false }} initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SignIn" component={Signin} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="ForgetPass" component={ForgetPass} />
        <Stack.Screen name="ShopList" component={ShopList} />
        <Stack.Screen name="Shop" component={Shop} />
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Ticket" component={Ticket} />
        <Stack.Screen name="Main" component={Tabnavigator} />
        <Stack.Screen name="Cart" component={Cart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
