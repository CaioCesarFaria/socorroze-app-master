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
import {
  getAuth,
  updateEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import { useNavigation } from "@react-navigation/native";

export default function UserProfile() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [senhaDigitada, setSenhaDigitada] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

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
  
  const confirmarExclusao = async () => {
    setConfirmLoading(true);
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, senhaDigitada);
  
      // Reautentica o usuário
      await reauthenticateWithCredential(user, credential);
  
      // Exclui do Firestore
      const userRef = doc(db, "usuarios", user.uid);
      await deleteDoc(userRef); // agora deletando completamente o documento
  
      // Exclui do Auth
      await deleteUser(user);
  
      Alert.alert("Conta excluída", "Sua conta foi removida com sucesso.");
  
      // Deslogar e redirecionar
      navigation.replace("Login");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      Alert.alert("Erro", "Senha incorreta ou erro ao excluir conta.");
    } finally {
      setConfirmLoading(false);
      setSenhaDigitada("");
      setShowModal(false);
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
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#666", marginTop: 10 },
              ]}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.buttonText}>Excluir Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSalvar}>
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
        {showModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              <Text style={styles.modalText}>
                Digite sua senha para confirmar a exclusão da conta:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senhaDigitada}
                onChangeText={setSenhaDigitada}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#ccc" }]}
                  onPress={() => {
                    setSenhaDigitada("");
                    setShowModal(false);
                  }}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#C54343" }]}
                  onPress={confirmarExclusao}
                  disabled={confirmLoading}
                >
                  <Text style={styles.buttonText}>
                    {confirmLoading ? "Excluindo..." : "Confirmar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
    marginTop: 20,
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C54343",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  
});
