import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Switch } from 'react-native';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const auth = getAuth();
    // Configurar persistência de acordo com o estado de `keepLoggedIn`
    

    try {
      const persistenceMode = keepLoggedIn ? browserLocalPersistence : browserSessionPersistence;
      // Tenta fazer o login com e-mail e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = userCredential.user.uid === "9izwMEqZtJcvkS0tCyGuF7xAC8t1"; // CRIANDO A CHAVE DE ADM 
      if (isAdmin) {
        navigation.navigate('HomeAdm', { isAdmin });
        Alert.alert("Bem-vindo Administrador");
      } else {
        const user = userCredential.user;  // Objeto do usuário autenticado

        // Se o login for bem-sucedido, navega para a tela "Home"
        console.log('Usuário autenticado:', user);
        navigation.replace('Home');  // Navegação para a tela Home
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Tratar erros com base no código de erro
      let customMessage = 'Erro ao fazer login.';
      if (errorCode === 'auth/user-not-found') {
        customMessage = 'Usuário não encontrado!';
      } else if (errorCode === 'auth/wrong-password') {
        customMessage = 'Senha incorreta!';
      } else if (errorCode === 'auth/invalid-email') {
        customMessage = 'E-mail inválido!';
      }

      Alert.alert('Erro', customMessage);  // Exibe a mensagem de erro ao usuário
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Faça seu login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
      />


      <View style={styles.switchContainer}>
        <Text>Manter login</Text>
        <Switch
          value={keepLoggedIn}
          onValueChange={setKeepLoggedIn}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor:"#f4b516"
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});