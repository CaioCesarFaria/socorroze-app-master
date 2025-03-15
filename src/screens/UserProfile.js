// UserProfile.js (completo corrigido e detalhado)
// UserProfile.js (Corrigido e Completo)
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { getAuth, updateEmail } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import app from "../firebase-config/firebasecofing";

export default function UserProfile() {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(getFirestore(app), "usuarios", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const dados = userSnap.data();
          setNome(dados.nome);
          setTelefone(dados.telefone);
          setEmail(user.email);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    setLoading(true);

    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

    if (!nome || !telefone || !email) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        nome,
        telefone,
      });

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      Alert.alert("Sucesso!", "Perfil atualizado com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bgfull.png")}
      style={styles.bgImagem}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Editar Perfil</Text>

          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Telefone"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Seu e-mail"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImagem: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#32345E",
    marginBottom: 20,
    alignSelf: "center",
    marginTop:20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#32345E",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#C54343",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
