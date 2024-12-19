import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import app from '../firebase-config/firebasecofing';
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
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

            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            console.log("Usuário cadastrado:", userCredential.user);
            navigation.navigate("Welcome");


            const userDoc = doc(db, 'usuarios', userCredential.user.uid);
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
            <SafeAreaView style={styles.container}>
                <Text style={styles.cadastroTitle}>FAÇA SEU CADASTO</Text>
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
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.olhoIcone}>
                            <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
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
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.olhoIcone}>
                            <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                            onPress={() => setTermosAceitos(!termosAceitos)}
                            style={styles.checkboxOption}
                        >
                            <Icon
                                name={termosAceitos ? "checkbox" : "square-outline"}
                                size={24}
                                color="#007bff"
                            />
                            <Text style={styles.checkboxText}>
                                Li e concordo com os
                                <Text
                                    onPress={() => navigation.navigate('TermosDePrivacidade')}
                                    style={styles.linkText}
                                >
                                    {" "}termos de privacidade
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleCadastro}>
                        <Text style={styles.cadastrarButton}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor:"#f4b516"
    },
    cadastroTitle: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    containerCadastro: {
        // Aqui você pode adicionar estilos para o container, se necessário
    },
    inputLabel: {
        marginBottom: 8,
        fontSize: 16,
    },
    cadastroInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        marginBottom: 16,
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    olhoIcone: {
        position: 'absolute',
        right: 10, // Posiciona o ícone à direita
        padding: 10,
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
    checkboxText: {
        fontSize: 14,
        color: "#000",
        marginLeft: 8,
    },
    linkText: {
        color: "#1E90FF", // Azul para indicar o link
        textDecorationLine: "underline",
    },

    cadastrarButton: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#007BFF',
        color: '#FFF',
        borderRadius: 5,
    }
});
