import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Switch,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const auth = getAuth();
    // Configurar persistência de acordo com o estado de `keepLoggedIn`

    try {
      const persistenceMode = keepLoggedIn
        ? browserLocalPersistence
        : browserSessionPersistence;
      // Tenta fazer o login com e-mail e senha
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const isAdmin =
        userCredential.user.uid === "9izwMEqZtJcvkS0tCyGuF7xAC8t1"; // CRIANDO A CHAVE DE ADM
      if (isAdmin) {
        navigation.navigate("HomeAdm", { isAdmin });
        Alert.alert("Bem-vindo Administrador");
      } else {
        const user = userCredential.user; // Objeto do usuário autenticado

        // Se o login for bem-sucedido, navega para a tela "Home"
        console.log("Usuário autenticado:", user);
        navigation.replace("Home"); // Navegação para a tela Home
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Tratar erros com base no código de erro
      let customMessage = "Erro ao fazer login.";
      if (errorCode === "auth/user-not-found") {
        customMessage = "Usuário não encontrado!";
      } else if (errorCode === "auth/wrong-password") {
        customMessage = "Senha incorreta!";
      } else if (errorCode === "auth/invalid-email") {
        customMessage = "E-mail inválido!";
      }

      Alert.alert("Erro", customMessage); // Exibe a mensagem de erro ao usuário
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bglogin.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Image
          style={styles.logoWelcome}
          source={require("../../assets/iconlogo.png")}
        ></Image>
        <Text style={styles.title}>Bem-vindo ao Socorro Zé</Text>
        <View style={styles.boxInputs}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
          />
        </View>
        <View style={styles.boxLinha}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Manter login</Text>
            <Switch
              trackColor={{ false: "#fff", true: "#C54343" }} // Cor do espaço
              thumbColor={keepLoggedIn ? "#fff" : "#FF0000"} // Cor da bolinha
              value={keepLoggedIn}
              onValueChange={setKeepLoggedIn}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("EsqueciSenha")}
            style={styles.btnEsqueciSenha}
          >
            <Text style={styles.esqueciSenhaText}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f4b516",
  },
  logoWelcome: {
    width: 150,
    resizeMode: "contain",
    alignSelf: "center",
  },
  title: {
    color: "#27294A",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    paddingHorizontal: "10%",
  },
  boxInputs: {
    paddingHorizontal: 10,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 16,
    paddingLeft: 15,
    color: "#32345E",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 7,
    backgroundColor: "#FFFFFF", // Cor de fundo
    shadowColor: "#000", // Cor da sombra
    shadowOffset: { width: 0, height: 6 }, // Deslocamento da sombra
    shadowOpacity: 0.4, // Opacidade da sombra (0 a 1)
    shadowRadius: 10, // Desfoque da sombra
    fontSize: 14,
    elevation: 10, // Elevação (necessário para Android)
    color: "#000",
    marginBottom: 16,
    width: "100%",
  },
  boxLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  switchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  switchText: {
    color: "#32345E",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  esqueciSenhaText: {
    color: "#32345E",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#C54343",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    paddingHorizontal: "10%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
