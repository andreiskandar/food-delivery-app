import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Restaurant, OrderDelivery } from './screens/';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'Home'}>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Restaurant' component={Restaurant} />
        <Stack.Screen name='OrderDelivery' component={OrderDelivery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
