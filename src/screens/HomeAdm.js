import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ImageBackground } from "react-native";
import { auth } from "../firebase-config/firebasecofing";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

export default function HomeAdm() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);

        // Acesso ao Firestore para pegar dados adicionais do usuário
        const db = getFirestore(); // Instancia o Firestore
        const userRef = doc(db, "usuarios", userAuth.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null); // Caso não esteja logado, limpa o estado do usuário
        setUserData(null); // Limpa os dados do usuário
      }
    });

    // Limpeza do listener ao desmontar o componente
    return () => unsubscribeAuth();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bgwhite.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        <Text style={styles.welcomeText}>
          {user
            ? `Olá, ${user.displayName || userData?.nome || "Usuário"}`
            : "Você não está logado"}
        </Text>
        <View style={styles.containerMain}>
        <TouchableOpacity
          style={styles.btnNewClient}
          onPress={() => navigation.navigate("NewClient")}
        >
          <Text style={styles.buttonText}>Cadastrar Novo Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnHome}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Ir para a Página Inicial</Text>
        </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgImagem: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    height:"100%",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#f4f4f4", // cor de fundo suave
  },
  welcomeText: {
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  containerMain: {
    flexDirection:'column',
    alignItems:'center'
  },
  btnNewClient: {
    backgroundColor: "#007BFF", // cor do botão
    padding: 16,
    borderRadius: 5,
    width: "80%",
    marginBottom: 20,
    alignItems: "center",
  },
  btnHome: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 5,
    width: "80%",
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
