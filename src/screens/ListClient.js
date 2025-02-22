import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import app from "../firebase-config/firebasecofing";

export default function ListClient() {
  const [mecanicas, setMecanicas] = useState([]);
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

  return (
    <View style={styles.container}>
      <FlatList
        data={mecanicas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("UpdateClient", { mecanicaId: item.id })}
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
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});