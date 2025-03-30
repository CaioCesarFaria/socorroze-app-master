// HomeTabs.js (com BottomTab estilizado)
import React from "react";
import { Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../firebase-config/firebasecofing";
import Home from "./Home";
import UserProfile from "./UserProfile";
import UserHistory from "./UserHistory";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#C54343",
        tabBarInactiveTintColor: "#32345e",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {  // <-- Inclusão de estilo para o texto da aba ativa
          fontSize: 14,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
  name="Historico"
  component={UserHistory}
  listeners={({ navigation }) => ({
    tabPress: e => {
      if (!auth.currentUser) {
        e.preventDefault();
        Alert.alert(
          "Atenção",
          "Você precisa estar logado para acessar o histórico.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Fazer login", onPress: () => navigation.navigate("Login") }
          ]
        );
      }
    }
  })}
  options={{
    tabBarIcon: ({ color, focused }) => (
      <Ionicons name={focused ? "time" : "time-outline"} color={color} size={24} />
    ),
  }}
/>

<Tab.Screen
  name="Perfil"
  component={UserProfile}
  listeners={({ navigation }) => ({
    tabPress: e => {
      if (!auth.currentUser) {
        e.preventDefault();
        Alert.alert(
          "Atenção",
          "Você precisa estar logado para acessar o perfil.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Fazer login", onPress: () => navigation.navigate("Login") }
          ]
        );
      }
    }
  })}
  options={{
    tabBarIcon: ({ color, focused }) => (
      <Ionicons name={focused ? "person" : "person-outline"} color={color} size={24} />
    ),
  }}
/>
    </Tab.Navigator>
  );
}
