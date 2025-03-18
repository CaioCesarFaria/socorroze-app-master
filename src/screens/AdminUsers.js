// AdminUsers.js
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import app from "../firebase-config/firebasecofing";
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function AdminUsers() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const getUserRole = async (userId) => {
    const userRef = doc(db, "usuarios", userId);
    let userSnap = await getDoc(userRef);
    
    // Se não carregar de primeira, tenta novamente após 1 segundo
    let tentativas = 0;
    while (!userSnap.exists() && tentativas < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      userSnap = await getDoc(userRef);
      tentativas++;
    }
  
    if (!userSnap.exists()) {
      throw new Error("Erro: Conta do usuário atual não encontrada no Firestore.");
    }
  
    return userSnap.data().role;
  };
  
  const handleCadastroAdmin = async () => {
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Usuário não autenticado.");
        return;
      }
  
      const role = await getUserRole(user.uid);
      console.log("Role do usuário logado:", role);
  
      if (role !== "master") {
        alert("Permissão negada. Apenas usuários master podem criar administradores.");
        return;
      }
  
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        alert("Este e-mail já está em uso.");
        return;
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const newUserId = userCredential.user.uid;
      
      // Salva os dados do novo admin
      const userDoc = doc(db, "usuarios", newUserId);
      console.log("Tentando salvar usuário no caminho:", userDoc.path);
      
      await setDoc(userDoc, {
        nome: nome || "",
        cpf: cpf || "",
        telefone: telefone || "",
        email: email,
        role: "admin"
      });
  
      Alert.alert("Sucesso", "Administrador cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao cadastrar admin:", error);
      alert(error.message);
    }
  };
  

  return (
    <GestureHandlerRootView>
      <ImageBackground
        source={require("../../assets/bgfull.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={32} color="#C54343" />
                </TouchableOpacity>
                <Image
                  style={styles.logoWelcome}
                  source={require("../../assets/iconcadastro.png")}
                />
                <Text style={styles.cadastroTitle}>Novo Administrador</Text>
                <View style={styles.containerCadastro}>
                  <Text style={styles.inputLabel}>Nome Completo</Text>
                  <TextInput
                    style={styles.cadastroInput}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Digite o nome completo"
                    autoCorrect={false}
                  />

                  <Text style={styles.inputLabel}>CPF</Text>
                  <TextInput
                    style={styles.cadastroInput}
                    value={cpf}
                    onChangeText={setCpf}
                    placeholder="Digite o CPF"
                    keyboardType="numeric"
                  />

                  <Text style={styles.inputLabel}>Telefone</Text>
                  <TextInput
                    style={styles.cadastroInput}
                    value={telefone}
                    onChangeText={setTelefone}
                    placeholder="Digite o telefone com DDD"
                    keyboardType="phone-pad"
                  />

                  <Text style={styles.inputLabel}>E-mail</Text>
                  <TextInput
                    style={styles.cadastroInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite o e-mail"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />

                  <Text style={styles.inputLabel}>Senha</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.cadastroInput}
                      value={senha}
                      onChangeText={setSenha}
                      placeholder="Crie uma senha"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.olhoIcone}
                    >
                      <Icon
                        name={showPassword ? "eye-off" : "eye"}
                        size={26}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.inputLabel}>Confirmar Senha</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.cadastroInput}
                      value={confirmarSenha}
                      onChangeText={setConfirmarSenha}
                      placeholder="Confirme a senha"
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={styles.olhoIcone}
                    >
                      <Icon
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={26}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={handleCadastroAdmin}>
                    <Text style={styles.cadastrarButton}>
                      Cadastrar Administrador
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

// Use os mesmos styles do Cadastro.js ou ajuste conforme necessário
const styles = StyleSheet.create({
  bgImagem: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  backButton: {
    paddingTop: 25,
    paddingLeft: 5,
  },
  logoWelcome: {
    width: 100,
    resizeMode: "contain",
    alignSelf: "center",
  },
  cadastroTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: "#32345E",
    fontWeight: "bold",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  containerCadastro: {
    // Aqui você pode adicionar estilos para o container, se necessário
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 16,
    paddingLeft: 15,
    color: "#32345E",
  },
  cadastroInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 7,
    backgroundColor: "#FFFFFF", // Cor de fundo
    shadowColor: "#000", // Cor da sombra
    shadowOffset: { width: 0, height: 6 }, // Deslocamento da sombra
    shadowOpacity: 0.4, // Opacidade da sombra (0 a 1)
    shadowRadius: 10, // Desfoque da sombra

    elevation: 10, // Elevação (necessário para Android)
    padding: 15,
    marginBottom: 16,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  olhoIcone: {
    right: 10, // Espaço entre o input e o ícone
    justifyContent: "center", // Alinha verticalmente o ícone
    alignItems: "center", // Centraliza o ícone verticalmente
    position: "absolute",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxIcon: {
    borderRadius: 50,
  },
  checkboxText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 8,
    fontStyle: "italic",
  },
  linkText: {
    color: "#C54343", // Azul para indicar o link
  },

  cadastrarButton: {
    textAlign: "center",
    padding: 10,
    backgroundColor: "#C54343",
    color: "#FFF",
    borderRadius: 50,
    width: "50%",
    alignSelf: "center",
    fontWeight: "bold",
  },
});
