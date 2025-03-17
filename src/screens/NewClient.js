// NewClient.js
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
  ImageBackground,
  Image,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import app from "../firebase-config/firebasecofing";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function NewClient() {
  const navigation = useNavigation();
  const [cidade, setCidade] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [atendeMoto, setAtendeMoto] = useState(null);
  const [atendeCarro, setAtendeCarro] = useState(null);
  const [eh24Horas, setEh24Horas] = useState(false);
  const [responsavel, setResponsavel] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [endereco, setEndereco] = useState("");
  const [documentId, setDocumentId] = useState("");
  const db = getFirestore(app);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mapsLink, setMapsLink] = useState("");
  const auth = getAuth();
  const ownerId = auth.currentUser.uid;
  const storage = getStorage(app);

  const categoriasPredefinidas = [
    "Elétrica",
    "Mecânica",
    "Lanternagem",
    "Guincho",
    "Borracharia",
    "Pintura",
    "Revisão",
  ];
  // Função para extrair coordenadas do link:
  const extractCoordinates = (url) => {
    const formats = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/, // Formato padrão @lat,lng
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // Formato alternativo !3dlat!4dlng
      /lat=(-?\d+\.\d+)&lng=(-?\d+\.\d+)/, // Formato de URL alternativa
    ];

    for (const regex of formats) {
      const match = url.match(regex);
      if (match && match.length >= 3) {
        return {
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
        };
      }
    }
    return null;
  };

  // Estado para armazenar os dias de funcionamento
  const [diasFuncionamento, setDiasFuncionamento] = useState({
    segunda: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    terca: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    quarta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    quinta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    sexta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    sabado: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    domingo: { aberto: false, abertura: "08:00", fechamento: "18:00" },
  });

  const diasFuncionamentoNumerico = Object.entries(diasFuncionamento).reduce(
    (acc, [dia, dados]) => {
      const diasMap = {
        segunda: 1,
        terca: 2,
        quarta: 3,
        quinta: 4,
        sexta: 5,
        sabado: 6,
        domingo: 0,
      };
      acc[diasMap[dia]] = dados; // Converte os dias para números
      return acc;
    },
    {}
  );

  // Definindo os horários
  const horarios = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  // 4. Função para alternar a seleção de categoria
  const toggleCategoria = (categoria) => {
    setCategorias((prevCategorias) =>
      prevCategorias.includes(categoria)
        ? prevCategorias.filter((cat) => cat !== categoria)
        : [...prevCategorias, categoria]
    );
  };
  // Função para abrir a galeria e fazer o upload da imagem
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à galeria para selecionar uma imagem."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        // Upload da imagem para o Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = ref(storage, `images/${Date.now()}`); // Caminho no Storage
        await uploadBytes(imageRef, blob);

        // Obtenha a URL pública da imagem
        const downloadURL = await getDownloadURL(imageRef);
        
        // Atualize o estado
        setSelectedImage(downloadURL);
        Alert.alert("Sucesso!", "Imagem carregada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao carregar a imagem:", error);
      Alert.alert("Erro", "Não foi possível carregar a imagem.");
    }
  };
  // Função para alterar os horários de funcionamento
  const handleHorarioChange = (dia, tipo, valor) => {
    setDiasFuncionamento((prevState) => ({
      ...prevState,
      [dia]: {
        ...prevState[dia],
        [tipo]: valor,
      },
    }));
  };
  // Função para enviar dados ao Firestore
  const handleNewClient = async () => {
    try {
      const auth = getAuth(); // 👈 Obtenha a instância de autenticação
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado!");
        return;
      }
      const coords = extractCoordinates(mapsLink);

      if (!coords) {
        Alert.alert("Erro", "Link do Google Maps inválido!");
        return;
      }
      // Adiciona um novo documento com os dados da mecânica
      const docRef = await addDoc(collection(db, "mecanicas"), {
        cidade: cidade,
        nomeFantasia: nomeFantasia,
        atendeMoto: atendeMoto,
        atendeCarro: atendeCarro,
        eh24Horas: eh24Horas,
        responsavel: responsavel,
        cpfResponsavel: cpfResponsavel,
        telefone: telefone,
        categorias: categorias,
        endereco: endereco,
        mapsLink,
        latitude: coords.latitude,
        longitude: coords.longitude,
        diasFuncionamento: diasFuncionamentoNumerico,
        selectedImage: selectedImage,
        ownerId: user.uid,
        ativo: true,
      });
      // Armazena o ID do documento recém-criado
      await updateDoc(docRef, { id: docRef.id });
      Alert.alert("Sucesso!", "Mecânica cadastrada com sucesso.");
      // Limpa os campos após o cadastro
      setCidade("");
      setNomeFantasia("");
      setSelectedImage(null);
      setAtendeMoto(null);
      setAtendeCarro(null);
      setEh24Horas(false);
      setResponsavel("");
      setCpfResponsavel("");
      setCategorias([]);
      setEndereco("");
      setDiasFuncionamento({
        segunda: { aberto: false, abertura: "08:00", fechamento: "18:00" },
        terca: { aberto: false, abertura: "08:00", fechamento: "18:00" },
        quarta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
        quinta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
        sexta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
        sabado: { aberto: false, abertura: "08:00", fechamento: "18:00" },
        domingo: { aberto: false, abertura: "08:00", fechamento: "18:00" },
      });
    } catch (error) {
      console.error("Erro ao cadastrar mecânica:", error);
      Alert.alert("Erro", "Não foi possível cadastrar a mecânica.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bgwhite.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrolista}>
          <Text style={styles.title}>Cadastrar Nova Mecânica</Text>
          {/* Cidade */}
          <Text style={styles.label}>Cidade</Text>
          <Picker
            selectedValue={cidade}
            onValueChange={(itemValue) => setCidade(itemValue)}
            style={styles.picker}
            dropdownIconColor="BLACK"
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Selecione a cidade" value="" />
            <Picker.Item label="Anápolis" value="Anápolis" />
            <Picker.Item label="Rio de Janeiro" value="Rio de Janeiro" />
            <Picker.Item label="Goiânia" value="Goiânia" />
          </Picker>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nomeFantasia}
            onChangeText={setNomeFantasia}
            placeholder="Nome da mecânica"
          />
          <Text style={styles.label}>Foto da Mecânica</Text>
          <Button title="Selecionar Foto" onPress={pickImage} />
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
          <Text style={styles.label}>Atende Moto?</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => setAtendeMoto(true)}
              style={styles.checkboxOption}
            >
              <Icon
                name={atendeMoto === true ? "checkbox" : "square-outline"}
                size={24}
                color="#F4B516"
              />
              <Text>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAtendeMoto(false)}
              style={styles.checkboxOption}
            >
              <Icon
                name={atendeMoto === false ? "checkbox" : "square-outline"}
                size={24}
                color="#F4B516"
              />
              <Text>Não</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Atende Carro?</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => setAtendeCarro(true)}
              style={styles.checkboxOption}
            >
              <Icon
                name={atendeCarro === true ? "checkbox" : "square-outline"}
                size={24}
                color="#F4B516"
              />
              <Text>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAtendeCarro(false)}
              style={styles.checkboxOption}
            >
              <Icon
                name={atendeCarro === false ? "checkbox" : "square-outline"}
                size={24}
                color="#F4B516"
              />
              <Text>Não</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>24 Horas?</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => setEh24Horas(true)}
              style={styles.checkboxOption}
            >
              <Icon
                name={eh24Horas === true ? "checkbox" : "square-outline"}
                size={24}
                color="#F4B516"
              />
              <Text>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEh24Horas(false)}
              style={styles.checkboxOption}
            >
              <Icon
                name={eh24Horas === false ? "checkbox" : "square-outline"}
                size={24}
                color="#F4B516"
              />
              <Text>Não</Text>
            </TouchableOpacity>
          </View>
          {/* Dias de Funcionamento */}
          <Text style={styles.label}>Dias de Funcionamento</Text>
          {Object.keys(diasFuncionamento).map((dia) => (
            <View key={dia} style={styles.diaContainer}>
              {!eh24Horas && (
                <TouchableOpacity
                  onPress={() =>
                    handleHorarioChange(
                      dia,
                      "aberto",
                      !diasFuncionamento[dia].aberto
                    )
                  }
                  style={styles.checkboxOption}
                >
                  <Icon
                    name={
                      diasFuncionamento[dia].aberto
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={24}
                    color="#007bff"
                  />
                  <Text>{dia.charAt(0).toUpperCase() + dia.slice(1)}</Text>
                </TouchableOpacity>
              )}

              {diasFuncionamento[dia].aberto && !eh24Horas && (
                <View style={styles.horarioContainer}>
                  <View style={styles.horarioRow}>
                    <View style={styles.horarioPickerContainer}>
                      <Text>Abre às</Text>
                      <Picker
                        selectedValue={diasFuncionamento[dia].abertura}
                        onValueChange={(itemValue) =>
                          handleHorarioChange(dia, "abertura", itemValue)
                        }
                        style={styles.picker}
                      >
                        {horarios.map((hora, index) => (
                          <Picker.Item key={index} label={hora} value={hora} />
                        ))}
                      </Picker>
                    </View>

                    <View style={styles.horarioPickerContainer}>
                      <Text>Fecha às</Text>
                      <Picker
                        selectedValue={diasFuncionamento[dia].fechamento}
                        onValueChange={(itemValue) =>
                          handleHorarioChange(dia, "fechamento", itemValue)
                        }
                        style={styles.picker}
                      >
                        {horarios.map((hora, index) => (
                          <Picker.Item key={index} label={hora} value={hora} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
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
          {/* CAMPO PARA O TELEFONE QUE SERA USADO PRO WHATSAPP */}
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Telefone para contato"
            keyboardType="phone-pad"
          />
          {/* 7. Checkboxes para Categorias */}
          <Text style={styles.label}>Categorias</Text>
          {categoriasPredefinidas.map((categoria, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleCategoria(categoria)}
              style={[
                styles.checkboxOption,
                categorias.includes(categoria) && styles.checkboxSelected,
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
          <Text style={styles.label}>Link do Google Maps</Text>
          <TextInput
            style={styles.input}
            value={mapsLink}
            onChangeText={setMapsLink}
            placeholder="Cole o link completo do Google Maps"
            keyboardType="url"
          />
          <TouchableOpacity onPress={handleNewClient} style={styles.button}>
            <Text style={styles.buttonText}>Cadastrar Mecânica</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
  bgImagem: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrolista: {
    paddingHorizontal: 30,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  picker: {
    height: "auto",
    width: "100%",
    opacity: 0.8,
    backgroundColor: "#F4B516",
    borderRadius: 10,
    overflow: "hidden",
    color: "#000",
  },
  pickerItem: {
    backgroundColor: "#F4B516",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  horarioContainer: {
    marginBottom: 16,
  },
  horarioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  horarioPickerContainer: {
    width: "48%",
  },
  diaContainer: {
    marginBottom: 16,
  },
});
