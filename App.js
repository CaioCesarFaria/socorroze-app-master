import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase-config/firebasecofing';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StatusBar } from 'expo-status-bar';
import {  StyleSheet, Text, View } from 'react-native';


import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Home from './src/screens/Home';
import HomeAdm from './src/screens/HomeAdm';
import NewClient from './src/screens/NewClient';
import TermosDePrivacidade from './src/screens/TermosDePrivacidade';
import SplashScreen from './src/screens/Splash';
import Details from './src/screens/Details';
import EsqueciSenha from './src/screens/EsqueciSenha';





export default function App() {
  const Stack = createStackNavigator();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser(userAuth); // Se o usuário estiver logado, armazena os dados do usuário
      } else {
        setUser(null); // Caso contrário, garante que o usuário não estará logado
      }
      setTimeout(() => {
        setIsLoading(false); 
      }, 1500);
    });
    
    return () => unsubscribeAuth();
  }, []);
  if (isLoading) { 
    return <SplashScreen />; 
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Welcome' options={{headerShown:false}} component={Welcome}/>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Cadastro' options={{headerShown:false}} component={Cadastro} />
        <Stack.Screen name='Login' options={{headerShown:false}} component={Login} />
        <Stack.Screen name= 'HomeAdm' component={HomeAdm}/>
        <Stack.Screen name='NewClient' component={NewClient}/>
        <Stack.Screen name='TermosDePrivacidade' component={TermosDePrivacidade}/>
        <Stack.Screen name='Details' options={{headerShown:false}} component={Details}/>
        <Stack.Screen name='EsqueciSenha' component={EsqueciSenha}/>
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
