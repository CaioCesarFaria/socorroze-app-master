import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import app from '../firebase-config/firebasecofing';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import  Icon  from "react-native-vector-icons/Ionicons";

export default function NewClient() {


    const navigation = useNavigation();
    const [cidade, setCidade] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [atendeMoto, setAtendeMoto] = useState(null);
    const [atendeCarro, setAtendeCarro] = useState(null);
    const [eh24Horas, setEh24Horas] = useState(null);
    const [responsavel, setResponsavel] = useState('');
    const [cpfResponsavel, setCpfResponsavel] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [endereco, setEndereco] = useState('');
    const db = getFirestore(app);

    const categoriasPredefinidas = ["Elétrica", "Mecânica", "Lanternagem", "Guincho", "Borracharia", "Pintura", "Revisão"];
    
    // 4. Função para alternar a seleção de categoria
    const toggleCategoria = (categoria) => {
        setCategorias(prevCategorias =>
            prevCategorias.includes(categoria)
                ? prevCategorias.filter(cat => cat !== categoria)
                : [...prevCategorias, categoria]
        );
    };
    
    // Função para enviar dados ao Firestore
    const handleNewClient = async () => {
        try {
            // Adiciona um novo documento com os dados da mecânica
            await addDoc(collection(db, "mecanicas"), {
                cidade: cidade,
                nomeFantasia: nomeFantasia,
                atendeMoto: atendeMoto,
                atendeCarro: atendeCarro,
                eh24Horas: eh24Horas,
                responsavel: responsavel,
                cpfResponsavel: cpfResponsavel,
                categorias: categorias,
                endereco: endereco,
            });

            Alert.alert("Sucesso!", "Mecânica cadastrada com sucesso.");
            // Limpa os campos após o cadastro
            setCidade('');
            setNomeFantasia('');
            setAtendeMoto(null);
            setAtendeCarro(null);
            setEh24Horas(null);
            setResponsavel('');
            setCpfResponsavel('');
            setCategorias([]);
            setEndereco('');
        } catch (error) {
            console.error("Erro ao cadastrar mecânica:", error);
            Alert.alert("Erro", "Não foi possível cadastrar a mecânica.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Cadastrar Nova Mecânica</Text>

                <Text style={styles.label}>Cidade</Text>
                <TextInput
                    style={styles.input}
                    value={cidade}
                    onChangeText={setCidade}
                    placeholder="Cidade da mecânica"
                />

                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={nomeFantasia}
                    onChangeText={setNomeFantasia}
                    placeholder="Nome da mecânica"
                />

<Text style={styles.label}>Atende Moto?</Text>
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setAtendeMoto(true)} style={styles.checkboxOption}>
                        <Icon name={atendeMoto === true ? "checkbox" : "square-outline"} size={24} color="#007bff" />
                        <Text>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setAtendeMoto(false)} style={styles.checkboxOption}>
                        <Icon name={atendeMoto === false ? "checkbox" : "square-outline"} size={24} color="#007bff" />
                        <Text>Não</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Atende Carro?</Text>
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setAtendeCarro(true)} style={styles.checkboxOption}>
                        <Icon name={atendeCarro === true ? "checkbox" : "square-outline"} size={24} color="#007bff" />
                        <Text>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setAtendeCarro(false)} style={styles.checkboxOption}>
                        <Icon name={atendeCarro === false ? "checkbox" : "square-outline"} size={24} color="#007bff" />
                        <Text>Não</Text>
                    </TouchableOpacity>
                </View>


                <Text style={styles.label}>24 Horas?</Text>

                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setEh24Horas(true)} style={styles.checkboxOption}>
                        <Icon name={eh24Horas === true ? "checkbox" : "square-outline"} size={24} color="#007bff" />
                        <Text>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEh24Horas(false)} style={styles.checkboxOption}>
                        <Icon name={eh24Horas === false ? "checkbox" : "square-outline"} size={24} color="#007bff" />
                        <Text>Não</Text>
                    </TouchableOpacity>
                </View>
                

                <Text style={styles.label}>Nome do Responsável</Text>
                <TextInput
                    style={styles.input}
                    value={responsavel}
                    onChangeText={setResponsavel}
                    placeholder="Responsável pela mecânica"
                />

                <Text style={styles.label}>CPF do Responsável</Text>
                <TextInput
                    style={styles.input}
                    value={cpfResponsavel}
                    onChangeText={setCpfResponsavel}
                    placeholder="CPF do responsável"
                />

                {/* 7. Checkboxes para Categorias */}
                <Text style={styles.label}>Categorias</Text>
                {categoriasPredefinidas.map((categoria, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => toggleCategoria(categoria)}
                        style={[
                            styles.checkboxOption,
                            categorias.includes(categoria) && styles.checkboxSelected
                        ]}
                    >
                        <Text>{categoria}</Text>
                    </TouchableOpacity>
                ))}

                <Text style={styles.label}>Endereço</Text>
                <TextInput
                    style={styles.input}
                    value={endereco}
                    onChangeText={setEndereco}
                    placeholder="Endereço completo da mecânica"
                />

                <TouchableOpacity onPress={handleNewClient} style={styles.button}>
                    <Text style={styles.buttonText}>Cadastrar Mecânica</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    checkbox: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});