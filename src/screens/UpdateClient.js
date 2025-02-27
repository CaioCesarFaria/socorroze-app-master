import React, { useState, useEffect } from "react";
import { 
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
    Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import app from "../firebase-config/firebasecofing";

export default function UpdateClient({ route }) {
  const { mecanicaId } = route.params;
  const navigation = useNavigation();
  const db = getFirestore(app);
  const storage = getStorage(app);

  // Estados
  const [cidade, setCidade] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [atendeMoto, setAtendeMoto] = useState(null);
  const [atendeCarro, setAtendeCarro] = useState(null);
  const [eh24Horas, setEh24Horas] = useState(false);
  const [responsavel, setResponsavel] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [mapsLink, setMapsLink] = useState("");
  const [diasFuncionamento, setDiasFuncionamento] = useState({
    segunda: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    terca: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    quarta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    quinta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    sexta: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    sabado: { aberto: false, abertura: "08:00", fechamento: "18:00" },
    domingo: { aberto: false, abertura: "08:00", fechamento: "18:00" },
  });
  const categoriasPredefinidas = [
    "Elétrica",
    "Mecânica",
    "Lanternagem",
    "Guincho",
    "Borracharia",
    "Pintura",
    "Revisão",
  ];

  // Definindo os horários
  const horarios = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  // Função para extrair coordenadas do link
  const extractCoordinates = (url) => {
    const formats = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
      /lat=(-?\d+\.\d+)&lng=(-?\d+\.\d+)/
    ];

    for (const regex of formats) {
      const match = url.match(regex);
      if (match && match.length >= 3) {
        return {
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2])
        };
      }
    }
    return null;
  };

  // Carregar dados existentes
  useEffect(() => {
    const loadMecanicaData = async () => {
      const docRef = doc(db, "mecanicas", mecanicaId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCidade(data.cidade);
        setNomeFantasia(data.nomeFantasia);
        setAtendeMoto(data.atendeMoto);
        setAtendeCarro(data.atendeCarro);
        setEh24Horas(data.eh24Horas);
        setResponsavel(data.responsavel);
        setCpfResponsavel(data.cpfResponsavel);
        setCategorias(data.categorias || []);
        setEndereco(data.endereco);
        setTelefone(data.telefone);
        setSelectedImage(data.selectedImage);
        setMapsLink(data.mapsLink || "");
        
        // Converter dias numéricos para formato de texto
        const diasConvertidos = {};
        Object.entries(data.diasFuncionamento).forEach(([diaNum, dados]) => {
          const diasMap = {
            0: "domingo", 1: "segunda", 2: "terca", 3: "quarta",
            4: "quinta", 5: "sexta", 6: "sabado"
          };
          diasConvertidos[diasMap[diaNum]] = dados;
        });
        setDiasFuncionamento(diasConvertidos);
      }
    };
    loadMecanicaData();
  }, []);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permissão necessária", "Permita acesso à galeria!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.mediaTypes.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = ref(storage, `images/${Date.now()}`);
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        setSelectedImage(downloadURL);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar imagem");
    }
  };

  const toggleCategoria = (categoria) => {
    setCategorias(prev => 
      prev.includes(categoria) 
        ? prev.filter(c => c !== categoria) 
        : [...prev, categoria]
    );
  };

  const handleHorarioChange = (dia, tipo, valor) => {
    setDiasFuncionamento(prev => ({
      ...prev,
      [dia]: { ...prev[dia], [tipo]: valor }
    }));
  };

  const handleUpdate = async () => {
    try {
      const coords = extractCoordinates(mapsLink);
      
      if (!coords) {
        Alert.alert("Erro", "Link do Google Maps inválido!");
        return;
      }

      // Converter dias para formato numérico
      const diasNumericos = Object.entries(diasFuncionamento).reduce((acc, [dia, dados]) => {
        const diasMap = {
          segunda: 1, terca: 2, quarta: 3, quinta: 4,
          sexta: 5, sabado: 6, domingo: 0
        };
        acc[diasMap[dia]] = dados;
        return acc;
      }, {});

      await updateDoc(doc(db, "mecanicas", mecanicaId), {
        cidade,
        nomeFantasia,
        atendeMoto,
        atendeCarro,
        eh24Horas,
        responsavel,
        cpfResponsavel,
        categorias,
        endereco,
        telefone,
        selectedImage,
        mapsLink,
        latitude: coords.latitude,
        longitude: coords.longitude,
        diasFuncionamento: diasNumericos
      });
      
      Alert.alert("Sucesso!", "Dados atualizados!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar");
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedImage) {
        const imageRef = ref(storage, selectedImage);
        await deleteObject(imageRef);
      }
      
      await deleteDoc(doc(db, "mecanicas", mecanicaId));
      Alert.alert("Sucesso!", "Mecânica excluída!");
      navigation.navigate("ListClient");
    } catch (error) {
      Alert.alert("Erro", "Falha ao excluir");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Editar Mecânica</Text>

        {/* Cidade */}
        <Text style={styles.label}>Cidade</Text>
        <Picker
          selectedValue={cidade}
          onValueChange={setCidade}
          style={styles.picker}
        >
          <Picker.Item label="Selecione" value="" />
          <Picker.Item label="Anápolis" value="Anápolis" />
          <Picker.Item label="Rio de Janeiro" value="Rio de Janeiro" />
          <Picker.Item label="Goiânia" value="Goiânia" />
        </Picker>

        {/* Nome Fantasia */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nomeFantasia}
          onChangeText={setNomeFantasia}
          placeholder="Nome da mecânica"
        />

        {/* Link do Google Maps */}
        <Text style={styles.label}>Link do Google Maps</Text>
        <TextInput
          style={styles.input}
          value={mapsLink}
          onChangeText={setMapsLink}
          placeholder="Cole o link completo do Google Maps"
          keyboardType="url"
        />

        {/* Foto */}
        <Text style={styles.label}>Foto</Text>
        <Button title="Alterar Foto" onPress={pickImage} />
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}

        {/* Atende Moto */}
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

        {/* Atende Carro */}
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

        {/* 24 Horas */}
        <Text style={styles.label}>24 Horas?</Text>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setEh24Horas(true)}
            style={styles.checkboxOption}
          >
            <Icon
              name={eh24Horas ? "checkbox" : "square-outline"}
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
              name={!eh24Horas ? "checkbox" : "square-outline"}
              size={24}
              color="#F4B516"
            />
            <Text>Não</Text>
          </TouchableOpacity>
        </View>

        {/* Dias de Funcionamento */}
        {!eh24Horas && (
          <>
            <Text style={styles.label}>Horário de Funcionamento</Text>
            {Object.keys(diasFuncionamento).map((dia) => (
              <View key={dia} style={styles.diaContainer}>
                <TouchableOpacity
                  onPress={() =>
                    handleHorarioChange(dia, "aberto", !diasFuncionamento[dia].aberto)
                  }
                  style={styles.checkboxOption}
                >
                  <Icon
                    name={diasFuncionamento[dia].aberto ? "checkbox" : "square-outline"}
                    size={20}
                    color="#007bff"
                  />
                  <Text style={styles.diaText}>
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </Text>
                </TouchableOpacity>

                {diasFuncionamento[dia].aberto && (
                  <View style={styles.horarioContainer}>
                    <View style={styles.horarioPickerContainer}>
                      <Text>Abertura:</Text>
                      <Picker
                        selectedValue={diasFuncionamento[dia].abertura}
                        onValueChange={(value) =>
                          handleHorarioChange(dia, "abertura", value)
                        }
                        style={styles.timePicker}
                      >
                        {horarios.map((hora) => (
                          <Picker.Item key={hora} label={hora} value={hora} />
                        ))}
                      </Picker>
                    </View>

                    <View style={styles.horarioPickerContainer}>
                      <Text>Fechamento:</Text>
                      <Picker
                        selectedValue={diasFuncionamento[dia].fechamento}
                        onValueChange={(value) =>
                          handleHorarioChange(dia, "fechamento", value)
                        }
                        style={styles.timePicker}
                      >
                        {horarios.map((hora) => (
                          <Picker.Item key={hora} label={hora} value={hora} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* Responsável */}
        <Text style={styles.label}>Responsável</Text>
        <TextInput
          style={styles.input}
          value={responsavel}
          onChangeText={setResponsavel}
          placeholder="Nome do responsável"
        />

        {/* CPF */}
        <Text style={styles.label}>CPF do Responsável</Text>
        <TextInput
          style={styles.input}
          value={cpfResponsavel}
          onChangeText={setCpfResponsavel}
          placeholder="CPF do responsável"
          keyboardType="numeric"
        />

        {/* Categorias */}
        <Text style={styles.label}>Categorias</Text>
        <View style={styles.categoriasContainer}>
          {categoriasPredefinidas.map((categoria, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleCategoria(categoria)}
              style={[
                styles.categoriaButton,
                categorias.includes(categoria) && styles.categoriaSelected
              ]}
            >
              <Text style={categorias.includes(categoria) && styles.categoriaText}>
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Endereço */}
        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Endereço completo"
        />

        {/* Telefone */}
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Telefone para contato"
          keyboardType="phone-pad"
        />

        {/* Botões */}
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Excluir Mecânica</Text>
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
  scrollContainer: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
    borderRadius: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  diaContainer: {
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  horarioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  horarioPickerContainer: {
    width: '48%',
  },
  timePicker: {
    height: 120,
    width: '100%',
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoriaButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 20,
  },
  categoriaSelected: {
    backgroundColor: '#007bff',
  },
  categoriaText: {
    color: 'white',
  },
  diaText: {
    fontWeight: '500',
  },
});