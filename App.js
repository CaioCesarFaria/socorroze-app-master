import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';


import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Home from './src/screens/Home';
import HomeAdm from './src/screens/HomeAdm';
import NewClient from './src/screens/NewClient';




const Tab = createBottomTabNavigator();

export default function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Welcome' options={{headerShown:false}} component={Welcome}/>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='Cadastro' component={Cadastro} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name= 'HomeAdm' component={HomeAdm}/>
        <Stack.Screen name='NewClient' component={NewClient}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
