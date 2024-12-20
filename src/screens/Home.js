import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const [mecanicas, setMecanicas] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <Text style={styles.title}>Mecânicas Cadastradas</Text>
      <FlatList
        data={mecanicas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
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

