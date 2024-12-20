import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../firebase-config/firebasecofing";

export default function Details({ route }) {
  const { id } = route.params; // Obtém o ID passado como parâmetro
  const db = getFirestore(app);
  const [mecanica, setMecanica] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar detalhes da mecânica pelo ID
  const fetchMecanicaDetails = async () => {
    try {
      const docRef = doc(db, "mecanicas", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMecanica({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("Nenhuma mecânica encontrada com esse ID.");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da mecânica:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMecanicaDetails();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  if (!mecanica) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Erro: Mecânica não encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{mecanica.nomeFantasia}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Cidade: {mecanica.cidade}</Text>
        <Text style={styles.detail}>Endereço: {mecanica.endereco}</Text>
        <Text style={styles.detail}>Telefone: {mecanica.telefone}</Text>
        <Text style={styles.detail}>
          Atende Moto: {mecanica.atendeMoto ? "Sim" : "Não"}
        </Text>
        <Text style={styles.detail}>
          Atende Carro: {mecanica.atendeCarro ? "Sim" : "Não"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detail: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
