// Home.js
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
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";

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

  // Função para verificar se a mecânica está aberta
  const isMechanicOpen = (diasFuncionamento) => {
    const diaAtual = moment().format("dddd").toLowerCase(); // Nome do dia em inglês
    const horarioAtual = moment().format("HH:mm"); // Hora atual no formato 24h

    if (diasFuncionamento[diaAtual]?.aberto) {
      const { abertura, fechamento } = diasFuncionamento[diaAtual];
      return horarioAtual >= abertura && horarioAtual <= fechamento;
    }
    return false;
    
  };

  // Renderização da lista de mecânicas
  const renderItem = ({ item }) => {
    const aberto = isMechanicOpen(item.diasFuncionamento);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Details", { id: item.id })}
      >
        <View style={styles.status}>
          <View
            style={[
              styles.statusCircle,
              { backgroundColor: aberto ? "green" : "red" },
            ]}
          />
          <Text style={styles.statusText}>{aberto ? "Aberto" : "Fechado"}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.nomeFantasia}</Text>
        <Text style={styles.cardSubtitle}>{item.cidade}</Text>
        <TouchableOpacity
          style={styles.cardZap}
          onPress={() =>
            Linking.openURL(`https://wa.me/${item.telefoneResponsavel}`)
          }
        >
          <Ionicons name="logo-whatsapp" size={24} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
    color: "#32345E",
    fontSize: 16,
    fontWeight: "bold",
  },
  containerMecanicas: {
    flex: 1,
    backgroundColor: "#C54343",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 7,
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
  status: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
});
