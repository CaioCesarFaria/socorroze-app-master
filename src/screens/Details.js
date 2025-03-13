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
  Linking
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

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

export default function Details({ route }) {
  const navigation = useNavigation();
  const { id } = route.params; // Obtém o ID passado como parâmetro
  const db = getFirestore(app);
  const [mecanica, setMecanica] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const distanciaExemplo = "2 KM"; // Se tiver distância real, substitua

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
              <View style={styles.ratingContainer}>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.distance}>{distanciaExemplo}</Text>
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
            const mensagem = encodeURIComponent(
              `Olá, encontrei sua mecânica \"${mecanica.nomeFantasia}\" pelo aplicativo Socorro Zé. Você poderia me atender agora?`
            );
            Linking.openURL(`https://wa.me/${mecanica.telefone}?text=${mensagem}`);
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
            <Text style={styles.infoText}>Cidade: {mecanica.cidade}</Text>
            <Text style={styles.infoText}>Endereço: {mecanica.endereco}</Text>
            <Text style={styles.infoText}>
              Telefone:{" "}
              {mecanica.telefone ? mecanica.telefone : "Não informado"}
            </Text>
            <Text style={styles.infoText}>
              Atende Moto: {mecanica.atendeMoto ? "Sim" : "Não"}
            </Text>
            <Text style={styles.infoText}>
              Atende Carro: {mecanica.atendeCarro ? "Sim" : "Não"}
            </Text>
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
    flexDirection:'row',
    alignItems:'center',
    marginBottom:20,
    marginTop:10,
    columnGap:10,
  },
  backButtonText: {
    fontSize:16,
    color:'#34325e'
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
  ratingContainer: {
    flexDirection: "row",
    columnGap: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  stars: {
    color: "#FFD700",
    fontSize: 16,
  },
  distance: {
    color: "#fff",
    fontSize: 16,
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
    justifyContent:'center',
    marginTop: 20,
    marginHorizontal:30,
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
    fontWeight:'bold',
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
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
