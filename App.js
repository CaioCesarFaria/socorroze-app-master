import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Welcome from "./src/screens/Welcome";
import Login from "./src/screens/Login";
import Cadastro from "./src/screens/Cadastro";
import HomeAdm from "./src/screens/HomeAdm";
import NewClient from "./src/screens/NewClient";
import TermosDePrivacidade from "./src/screens/TermosDePrivacidade";
import SplashScreen from "./src/screens/Splash";
import Details from "./src/screens/Details";
import EsqueciSenha from "./src/screens/EsqueciSenha";
import ListClient from "./src/screens/ListClient";
import UpdateClient from "./src/screens/UpdateClient";
import AdminUsers from "./src/screens/AdminUsers";
import HomeTabs from "./src/screens/HomeTabs";
import Tutorial from "./src/screens/Tutorial";

export default function App() {
  const Stack = createStackNavigator();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tutorialVisto, setTutorialVisto] = useState(false);

  // Verifica se o tutorial já foi visto
  useEffect(() => {
    const auth = getAuth();
    const checkTutorial = async () => {
      const visto = await AsyncStorage.getItem("@tutorialVisto");
      setTutorialVisto(visto === "true");
    };

    checkTutorial();
  }, []);

  // ✅ Verifica o login automaticamente
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      setUser(userAuth || null);
      setIsLoading(false); // ✅ tiramos o timeout desnecessário
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        {/* ✅ Se o tutorial ainda não foi visto */}
        {!tutorialVisto && (
  <Stack.Screen name="Tutorial" component={Tutorial} options={{ headerShown: false }} />
)}

{tutorialVisto && (
  <>
    <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />

    {/* Se tiver logado */}
    {user ? null : (
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
    )}

    {/* ✅ Rotas públicas */}
    <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    <Stack.Screen name="TermosDePrivacidade" component={TermosDePrivacidade} options={{ headerShown: false }} />
    <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />

    {/* ✅ Rotas internas */}
    <Stack.Screen name="HomeAdm" component={HomeAdm} options={{ headerShown: false }} />
    <Stack.Screen name="NewClient" component={NewClient} options={{ headerShown: false }} />
    <Stack.Screen name="Details" component={Details} options={{ headerShown: false }} />
    <Stack.Screen name="ListClient" component={ListClient} options={{ headerShown: false }} />
    <Stack.Screen name="AdminUsers" component={AdminUsers} options={{ headerShown: false }} />
    <Stack.Screen name="UpdateClient" component={UpdateClient} options={{ headerShown: false }} />
  </>
)}


      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
