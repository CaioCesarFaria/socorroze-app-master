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
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleCadastro = async () => {
    if (!termosAceitos) {
      alert("Você precisa aceitar os termos de privacidade para se cadastrar.");
      return;
    }
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        alert("Este e-mail já está em uso.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      console.log("Usuário cadastrado:", userCredential.user);
      navigation.navigate("Welcome");

      const userDoc = doc(db, "usuarios", userCredential.user.uid);
      await setDoc(userDoc, {
        nome: nome,
        telefone: telefone,
        email: email,
      });

      console.log("Informações do usuário salvas no Firestore");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
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
                <Image
                  style={styles.logoWelcome}
                  source={require("../../assets/iconcadastro.png")}
                ></Image>
                <Text style={styles.cadastroTitle}>Cadastro</Text>
                <View style={styles.containerCadastro}>
                  <Text style={styles.inputLabel}>Nome Completo</Text>
                  <TextInput
                    style={styles.cadastroInput}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Digite seu nome"
                    autoCorrect={false}
                  />

                  <Text style={styles.inputLabel}>Telefone</Text>
                  <TextInput
                    style={styles.cadastroInput}
                    value={telefone}
                    onChangeText={setTelefone}
                    placeholder="Digite seu telefone com DDD"
                    autoCorrect={false}
                  />

                  <Text style={styles.inputLabel}>E-mail</Text>
                  <TextInput
                    style={styles.cadastroInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite seu e-mail"
                    autoCorrect={false}
                  />

                  <Text style={styles.inputLabel}>Crie uma Senha</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.cadastroInput}
                      value={senha}
                      onChangeText={setSenha}
                      placeholder="Digite sua senha"
                      autoCorrect={false}
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

                  <Text style={styles.inputLabel}>Confirme sua senha</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.cadastroInput}
                      value={confirmarSenha}
                      onChangeText={setConfirmarSenha}
                      placeholder="Confirme sua senha"
                      autoCorrect={false}
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
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      onPress={() => setTermosAceitos(!termosAceitos)}
                      style={styles.checkboxOption}
                    >
                      <Icon
                        name={termosAceitos ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color="#fff"
                        
                        backgroundColor={termosAceitos ? "green" : "white"}
                        style={styles.checkboxIcon}
                      />
                      <Text style={styles.checkboxText}>
                        Li e concordo com os
                        <Text
                          onPress={() =>
                            navigation.navigate("TermosDePrivacidade")
                          }
                          style={styles.linkText}
                        >
                          {" "}
                          termos de privacidade
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={handleCadastro}>
                    <Text style={styles.cadastrarButton}>Cadastrar</Text>
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

    elevation: 15, // Elevação (necessário para Android)
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
    borderRadius:50,
    
  },
  checkboxText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 8,
    fontStyle:'italic'
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
    width:'50%',
    alignSelf:'center',
    fontWeight:'bold'
  },
});
