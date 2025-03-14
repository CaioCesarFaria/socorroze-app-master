// Login.js
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
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const db = getFirestore();
      const userRef = doc(db, "usuarios", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "admin" || userData.role === "master") {
          navigation.replace("HomeAdm", { isAdmin: true });
          Alert.alert("Bem-vindo Administrador");
        } else {
          navigation.replace("HomeTabs");
        }
      } else {
        navigation.replace("HomeTabs");
      }
    } catch (error) {
      const errors = {
        "auth/user-not-found": "Usuário não encontrado!",
        "auth/wrong-password": "Senha incorreta!",
        "auth/invalid-email": "E-mail inválido!",
      };
      Alert.alert("Erro", errors[error.code] || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <ImageBackground
              source={require("../../assets/bglogin.png")}
              style={styles.bgImagem}
              resizeMode="cover"
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={32} color="#C54343" />
              </TouchableOpacity>
              <Image
                style={styles.logoWelcome}
                source={require("../../assets/iconlogo.png")}
              />
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
                    trackColor={{ false: "#767577", true: "#C54343" }}
                    thumbColor={keepLoggedIn ? "#fff" : "#f4f3f4"}
                    value={keepLoggedIn}
                    onValueChange={setKeepLoggedIn}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("EsqueciSenha")}
                  style={styles.btnEsqueciSenha}
                >
                  <Text style={styles.esqueciSenhaText}>
                    Esqueci minha senha
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </ImageBackground>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    backgroundColor: "#f4b516",
  },
  backButton: {
    paddingTop: 25,
    paddingLeft: 5,
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
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    fontSize: 14,
    elevation: 10,
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
    marginHorizontal: "10%",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
