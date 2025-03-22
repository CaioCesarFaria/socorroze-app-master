// DETAILS
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

// Definindo os ícones para cada categoria (mesmos da Home.js)
const categoryIcons = {
  Mecânica: require("../../assets/icons/icon_mecanica.png"),
  Elétrica: require("../../assets/icons/icon_eletrica.png"),
  Lanternagem: require("../../assets/icons/icon_lanternagem.png"),
  Guincho: require("../../assets/icons/icon_guincho.png"),
  Borracharia: require("../../assets/icons/icon_borracharia.png"),
  Pintura: require("../../assets/icons/icon_pintura.png"),
  Revisão: require("../../assets/icons/icon_revisao.png"),
};

const abrirWhatsApp = (numero, nomeFantasia) => {
  const numeroLimpo = numero.replace(/\D/g, ""); // Remove qualquer caractere não numérico
  const mensagem = encodeURIComponent(`Olá, encontrei sua mecânica "${nomeFantasia}" pelo aplicativo Socorro Zé. Poderia me atender agora?`);
  const url = `https://wa.me/55${numeroLimpo}?text=${mensagem}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Erro", "Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado.");
      }
    })
    .catch(() => {
      Alert.alert("Erro", "Ocorreu um problema ao tentar abrir o WhatsApp.");
    });
};


export default function Details({ route }) {
  const navigation = useNavigation();
  const { id } = route.params; // Obtém o ID passado como parâmetro
  const db = getFirestore(app);
  const [mecanica, setMecanica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distancia, setDistancia] = useState(null);

  // Função para buscar detalhes da mecânica pelo ID
  const fetchMecanicaDetails = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "mecanicas", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMecanica({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("Nenhuma mecânica encontrada com esse ID.");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da mecânica:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMecanicaDetails();
  }, []);
  // Função para calcular a distância exata, igual à Home.js
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em KM

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em KM
  };

  // Função para pegar a localização do usuário e calcular a distância
  const getUserLocationAndCalculateDistance = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permissão de localização negada.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const userLat = location.coords.latitude;
    const userLon = location.coords.longitude;

    if (mecanica.latitude && mecanica.longitude) {
      const distanciaCalculada = haversineDistance(
        userLat,
        userLon,
        mecanica.latitude,
        mecanica.longitude
      );

      setDistancia(distanciaCalculada.toFixed(2)); // Formata para 2 casas decimais
    }
  };

  // Chamar a função assim que carregar os dados da mecânica
  useEffect(() => {
    if (mecanica) {
      getUserLocationAndCalculateDistance();
    }
  }, [mecanica]);
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#c54343" />
      </SafeAreaView>
    );
  }

  if (!mecanica) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Erro: Mecânica não encontrada.</Text>
      </SafeAreaView>
    );
  }

  // Exemplo de como você poderia “simular” o cálculo de aberto/fechado
  const isAberto = true;
  const horarioFechamento = "18:00";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4D4C7D" />
      <ImageBackground
        source={require("../../assets/bgwhite.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Cabeçalho com imagem (se existir) e nome */}
          {/* Botão de Voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#32345e" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          <View style={styles.headerCard}>
            {mecanica.selectedImage ? (
              <Image
                source={{ uri: mecanica.selectedImage }}
                style={styles.mecImage}
              />
            ) : (
              <Image
                source={require("../../assets/logopadrao.png")}
                style={styles.coverImage}
              />
            )}
            <View style={styles.infoMec}>
              <Text style={styles.mecName}>{mecanica.nomeFantasia}</Text>
              <View style={styles.distanceContainer}>
                <Ionicons name="location-outline" size={20} color="#32345E" />
                <Text style={styles.distanceText}>
                  {distancia ? `${distancia} km` : "Calculando..."}
                </Text>
              </View>
            </View>
          </View>

          {/* Categorias - renderiza somente os ícones das categorias que a mecânica atende */}
          <View style={styles.categoriesContainer}>
            {mecanica.categorias &&
              mecanica.categorias.map((cat, index) => (
                <View key={index} style={styles.categoryItem}>
                  <Image
                    source={categoryIcons[cat]}
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
          </View>

          {/* Status de aberto e fechamento */}
          <View style={styles.openCloseContainer}>
            <Icon
              name="time-outline"
              size={26}
              color="#32345e"
              style={{ marginRight: 6 }}
            />
            {isAberto ? (
              <Text style={styles.openText}>
                Aberto - Fecha às {horarioFechamento}
              </Text>
            ) : (
              <Text style={styles.closeText}>
                Fechado - Abre às {horarioFechamento}
              </Text>
            )}
          </View>

          {/* Botão Socorro Ze */}
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => {
              if (mecanica.telefone) {
                abrirWhatsApp(mecanica.telefone, mecanica.nomeFantasia);
              } else {
                Alert.alert("Aviso", "Telefone não disponível!");
              }
            }}
          >
            <Ionicons name="logo-whatsapp" size={28} color="white" />
            <Text style={styles.helpButtonText}>Socorro Zé</Text>
          </TouchableOpacity>

          {/* Informações adicionais */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={22} color="#32345E" />
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Cidade:</Text> {mecanica.cidade}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="map-outline" size={22} color="#32345E" />
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Endereço:</Text> {mecanica.endereco}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={22} color="#32345E" />
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Telefone:</Text>{" "}
                {mecanica.telefone ? mecanica.telefone : "Não informado"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="bicycle-outline"
                size={22}
                color={mecanica.atendeMoto ? "green" : "red"}
              />
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Atende Moto:</Text>{" "}
                {mecanica.atendeMoto ? "Sim" : "Não"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="car-sport-outline"
                size={22}
                color={mecanica.atendeCarro ? "green" : "red"}
              />
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Atende Carro:</Text>{" "}
                {mecanica.atendeCarro ? "Sim" : "Não"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  bgImagem: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    columnGap: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#34325e",
  },
  scrollContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  headerCard: {
    flexDirection: "row",
    backgroundColor: "#32345e",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    columnGap: 20,
  },
  mecImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  infoMec: {
    flexDirection: "column",
    rowGap: "10",
    alignItems: "center",
    justifyContent: "center",
  },
  mecName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4", // Fundo leve pra destacar
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start", // Faz o bloco ficar apenas do tamanho necessário
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombrinha chique pro Android
  },

  distanceText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 8, // Dá um espacinho do ícone
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 16,
    alignContent: "center",
    alignItems: "center",
  },
  categoryItem: {
    width: 90,
    height: 90,
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  categoryIcon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  categoryText: {
    marginTop: 4,
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  openCloseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 30,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  openText: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
  closeText: {
    fontSize: 16,
    color: "red",
  },
  helpButton: {
    flexDirection: "column",
    backgroundColor: "#48B624",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "25%",
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 14,
  },
  helpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    columnGap: 10, // Espaço entre o ícone e o texto
  },

  infoText: {
    fontSize: 16,
    color: "#32345E",
  },

  bold: {
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
