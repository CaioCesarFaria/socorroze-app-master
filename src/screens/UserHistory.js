// UserHistory.js (Histórico Corrigido Completo)
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../firebase-config/firebasecofing";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

export default function UserHistory() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarHistorico = async () => {
      setLoading(true); // inicia o loading visual
      try {
        const auth = getAuth(app);
        const user = auth.currentUser;
        const db = getFirestore(app);

        if (user) {
          const querySnapshot = await getDocs(
            collection(db, "usuarios", user.uid, "historicoContatos")
          );

          const contatos = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => b.dataContato.seconds - a.dataContato.seconds);

          setHistorico(contatos);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o histórico.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico(); // 👈 Invocação correta da função interna
  }, []);

  const renderContato = ({ item }) => {
    return (
      <View style={styles.itemContato}>
        <Text style={styles.nomeMecanica}>{item.mecanicaNome}</Text>
        <Text style={styles.dataContato}>
          {moment(item.dataContato.toDate()).format("DD/MM/YYYY [às] HH:mm")}
        </Text>
      </View>
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
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Histórico de Contatos</Text>
      </View>

      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={renderContato}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Você não possui contatos registrados.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#32345E",
    textAlign: "center",
  },
  itemContato: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nomeMecanica: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#32345E",
  },
  dataContato: {
    fontSize: 13,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    marginTop: 20,
  },
});

