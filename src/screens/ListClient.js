import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import app from "../firebase-config/firebasecofing";

export default function ListClient() {
  const [mecanicas, setMecanicas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const db = getFirestore(app);

  useEffect(() => {
    const fetchMecanicas = async () => {
      const querySnapshot = await getDocs(collection(db, "mecanicas"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setMecanicas(lista);
    };
    fetchMecanicas();
  }, []);

  const mecanicasFiltradas = useMemo(() => {
    return mecanicas.filter((mec) =>
      mec.nomeFantasia.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mecanicas, searchQuery]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#32345e" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mecânicas Cadastradas</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#32345E" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar mecânica por nome..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={mecanicasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("UpdateClient", { mecanicaId: item.id })
            }
          >
            <Text style={styles.nome}>{item.nomeFantasia}</Text>
            <Text>{item.telefone || "Sem telefone cadastrado"}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4B516",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    columnGap: 10,
  },
  backButtonText: { 
    fontSize: 16, 
    color: "#34325e" 
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#32345E",
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 16,
    color: "#32345E",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32345E",
  },

  searchInput: {
    flex: 1,
    paddingLeft: 10,
  },
});
