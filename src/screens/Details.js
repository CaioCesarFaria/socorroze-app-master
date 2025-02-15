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
  ScrollView
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import Icon from "react-native-vector-icons/Ionicons";

export default function Details({ route }) {
  const { id } = route.params; // Obtém o ID passado como parâmetro
  const db = getFirestore(app);
  const [mecanica, setMecanica] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar detalhes da mecânica pelo ID
  const fetchMecanicaDetails = async () => {
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
        <ActivityIndicator size="large" color="#007bff" />
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
  // Se quiser algo dinâmico, extraia do campo diasFuncionamento e compare com a hora atual.
  const isAberto = true; 
  const horarioFechamento = "18:00"; 
  const distanciaExemplo = "2 KM"; // Se tiver distância real, substitua

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../../assets/bgwhite.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Cabeçalho com imagem (se existir) e nome */}
          <View style={styles.headerCard}>
            {/* Caso a mecânica tenha imagem cadastrada no Firestore */}
            {mecanica.selectedImage ? (
              <Image
                source={{ uri: mecanica.selectedImage }}
                style={styles.mecImage}
              />
            ) : (
              <Image
                            source={{ uri: item.selectedImage }}
                            style={styles.coverImage}
                          />
            )}
            <Text style={styles.mecName}>{mecanica.nomeFantasia}</Text>
            <View style={styles.ratingContainer}>
              {/* Estrelas fixas ou calcule dinamicamente se quiser */}
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.distance}>{distanciaExemplo}</Text>
            </View>
          </View>

          {/* Categorias - Exemplo com ícones e textos */}
          <View style={styles.categoriesContainer}>
            {mecanica.categorias && mecanica.categorias.map((cat, index) => (
              <View key={index} style={styles.categoryItem}>
                {/* Ícone genérico, ajuste conforme cada categoria */}
                <Icon name="construct" size={28} color="#fff" />
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>

          {/* Status de aberto e fechamento */}
          <View style={styles.openCloseContainer}>
            <Icon name="time-outline" size={22} color="#000" style={{marginRight: 6}}/>
            {isAberto ? (
              <Text style={styles.openText}>Aberto - Fecha às {horarioFechamento}</Text>
            ) : (
              <Text style={styles.closeText}>Fechado - Abre às {horarioFechamento}</Text>
            )}
          </View>

          {/* Botão Socorro Ze */}
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Socorro Ze</Text>
          </TouchableOpacity>

          {/* Exemplo de mais informações se quiser (endereço, telefone, etc) */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Cidade: {mecanica.cidade}</Text>
            <Text style={styles.infoText}>Endereço: {mecanica.endereco}</Text>
            <Text style={styles.infoText}>
              Telefone: {mecanica.telefone ? mecanica.telefone : "Não informado"}
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
  scrollContainer: {
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  headerCard: {
    backgroundColor: "#4D4C7D",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  mecImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  mecName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    color: "#FFD700",
    fontSize: 16,
    marginRight: 8,
  },
  distance: {
    color: "#fff",
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    marginHorizontal: 16,
  },
  categoryItem: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#F4B516",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    marginTop: 4,
    color: "#fff",
    fontWeight: "bold",
  },
  openCloseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    // Sombras:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  openText: {
    fontSize: 16,
    color: "green",
  },
  closeText: {
    fontSize: 16,
    color: "red",
  },
  helpButton: {
    backgroundColor: "#48B624",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
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
    // Sombras:
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


