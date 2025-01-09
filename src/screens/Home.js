import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const auth = getAuth(app);


  const [nomeUsuario, setNomeUsuario] = useState("");
  const [mecanicas, setMecanicas] = useState([]);
  const [loading, setLoading] = useState(true);


  // Função para buscar os dados do usuário logado
  const fetchUsuario = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          setNomeUsuario(userDoc.data().nome);
        } else {
          console.warn("Usuário não encontrado no Firestore.");
        }
      } else {
        console.warn("Nenhum usuário está logado.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  // Função para buscar as mecânicas do Firestore
  const fetchMecanicas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mecanicas"));
      const mecanicasList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMecanicas(mecanicasList);
    } catch (error) {
      console.error("Erro ao buscar mecânicas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMecanicas();
  }, []);

  // Renderização da lista de mecânicas
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Details", { id: item.id })}
    >
      <Text style={styles.cardTitle}>{item.nomeFantasia}</Text>
      <Text style={styles.cardSubtitle}>{item.cidade}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bgfull.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      > 
        {loading ? (
          <ActivityIndicator size="large" color="#C54343" />
        ) : (
          <View>
            <Text style={styles.textSaudacao}>Olá, {nomeUsuario}!</Text>
          </View>
        )}
        <View style={styles.containerMecanicas}>
        <Text style={styles.title}>Mecânicas Cadastradas</Text>
        <FlatList
          data={mecanicas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
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
    backgroundColor: "#f5f5f5",
    
  },
  textSaudacao: {
    color:"#32345E",
    fontSize:16,
    fontWeight:'bold'
    
  },
  containerMecanicas: {
    flex:1,
    backgroundColor:"#C54343",
    marginTop:20,
    marginHorizontal:20,
    borderRadius:7,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
