// Home.js
// Home.js
import React, { useEffect, useState, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  Linking,
  ScrollView, // Para a barra de categorias
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import "moment/locale/pt-br";
import Ionicons from "@expo/vector-icons/Ionicons";

// Ícone de calendário (você já usava)
const calendarIcon = require("../../assets/icons/icon_calendar.png");

/** Ajuste para cada categoria, apontando para seus ícones correspondentes. */
const categoryIcons = {
  Elétrica: require("../../assets/icons/icon_eletrica.png"),
  Mecânica: require("../../assets/icons/icon_mecanica.png"),
  Lanternagem: require("../../assets/icons/icon_lanternagem.png"),
  Guincho: require("../../assets/icons/icon_guincho.png"),
  Borracharia: require("../../assets/icons/icon_borracharia.png"),
  Pintura: require("../../assets/icons/icon_pintura.png"),
  Revisão: require("../../assets/icons/icon_revisao.png"),
};

/** Suas categorias */
const categoriasPredefinidas = [
  "Borracharia",
  "Mecânica",
  "Elétrica",
  "Lanternagem",
  "Guincho",
  "Pintura",
  "Revisão",
];

moment.locale("pt-br");

export default function Home() {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [nomeUsuario, setNomeUsuario] = useState("");
  const [mecanicas, setMecanicas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para armazenar qual categoria está selecionada
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 1. Buscar dados do usuário logado
  const fetchUsuario = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          setNomeUsuario(userDoc.data().nome);
        } else {
          console.warn("Usuário não encontrado no Firestore.");
        }
      } else {
        console.warn("Nenhum usuário está logado.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Buscar as mecânicas do Firestore
  const fetchMecanicas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mecanicas"));
      const mecanicasList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMecanicas(mecanicasList);
    } catch (error) {
      console.error("Erro ao buscar mecânicas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
    fetchMecanicas();
  }, []);

  /**
   * Verifica se a mecânica está aberta AGORA (para mostrar "Aberto"/"Fechado").
   */
  const isMechanicOpen = (diasFuncionamento) => {
    if (!diasFuncionamento) return false;

    const currentDay = moment().day(); // 0=Dom, 1=Seg, ...
    const currentTimeStr = moment().format("HH:mm");
    const format = "HH:mm";

    const dayData = diasFuncionamento[currentDay];
    if (!dayData || !dayData.aberto) {
      return false;
    }

    const now = moment(currentTimeStr, format);
    const start = moment(dayData.abertura, format);
    const end = moment(dayData.fechamento, format);

    return now.isBetween(start, end, null, "[]");
  };

  /**
   * Gera o texto do calendário conforme as regras que você definiu antes.
   * (Mantive sua lógica, mas pode simplificar se quiser.)
   */
  const getScheduleText = (diasFuncionamento) => {
    if (!diasFuncionamento) return "";

    // Lista dos dias abertos (0=Dom, 1=Seg, ...)
    const openDays = [];
    for (let i = 0; i < 7; i++) {
      if (diasFuncionamento[i]?.aberto) {
        openDays.push(i);
      }
    }

    // Descobrir o dia de hoje e dados de hoje
    const today = moment().day();
    const todayData = diasFuncionamento[today];

    // Checar se abre TODOS os dias (0..6)
    if (openDays.length === 7) {
      if (todayData?.aberto) {
        return `Aberto todos os dias: ${todayData.abertura} - ${todayData.fechamento}`;
      } else {
        return `Aberto todos os dias (Hoje fechado)`;
      }
    }

    // Se abre de segunda(1) a sexta(5)
    const monToFri = [1, 2, 3, 4, 5];
    // Se abre de segunda(1) a sábado(6)
    const monToSat = [1, 2, 3, 4, 5, 6];

    const isMonFri =
      monToFri.every((d) => openDays.includes(d)) && openDays.length === 5;
    const isMonSat =
      monToSat.every((d) => openDays.includes(d)) && openDays.length === 6;

    if (isMonSat) {
      // "Seg-Sáb"
      if (todayData?.aberto) {
        return `Seg-Sáb: ${todayData.abertura} - ${todayData.fechamento}`;
      } else {
        return `Seg-Sáb (Hoje fechado)`;
      }
    } else if (isMonFri) {
      // "Seg-Sex"
      if (todayData?.aberto) {
        return `Seg-Sex: ${todayData.abertura} - ${todayData.fechamento}`;
      } else {
        return `Seg-Sex (Hoje fechado)`;
      }
    } else {
      // Caso não caia em nenhum dos cenários acima, exibir "Hoje:..."
      if (todayData?.aberto) {
        return `Hoje: ${todayData.abertura} - ${todayData.fechamento}`;
      } else {
        return "Hoje fechado";
      }
    }
  };

  /**
   * Lista de mecânicas filtrada (se `selectedCategory` != null)
   * e ordenada por nomeFantasia (ordem alfabética).
   */
  const displayedMecanicas = useMemo(() => {
    // Copia do array original
    let result = [...mecanicas];

    // Filtra se houver categoria selecionada
    if (selectedCategory) {
      result = result.filter((m) =>
        m.categorias?.includes(selectedCategory)
      );
    }

    // Ordena em ordem alfabética
    result.sort((a, b) => {
      return a.nomeFantasia.localeCompare(b.nomeFantasia);
    });

    return result;
  }, [mecanicas, selectedCategory]);

  // Renderização da lista de mecânicas
  const renderItem = ({ item }) => {
    const aberto = isMechanicOpen(item.diasFuncionamento);
    const scheduleText = getScheduleText(item.diasFuncionamento);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Details", { id: item.id })}
      >
        {/* PARTE ESQUERDA */}
        <View style={styles.leftContainer}>
          {/* Imagem circular com borda */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.selectedImage }}
              style={styles.coverImage}
            />
          </View>

          {/* Informações da mecânica */}
          <View style={styles.infoContainer}>
            <Text style={styles.cardTitle}>{item.nomeFantasia}</Text>

            {/* Linha do Calendário + Horário Customizado */}
            <View style={styles.calendarContainer}>
              <Image source={calendarIcon} style={styles.calendarIcon} />
              <Text style={styles.scheduleText}>{scheduleText}</Text>
            </View>

            {/* Ícones Carro e Moto em vermelho */}
            <View style={styles.mainRow}>
              <View style={styles.iconRow}>
                {item.atendeCarro && (
                  <Ionicons
                    name="car-sport-outline"
                    size={20}
                    color="#C54343"
                    style={{ marginRight: 8 }}
                  />
                )}
                {item.atendeMoto && (
                  <Ionicons
                    name="bicycle-outline"
                    size={20}
                    color="#C54343"
                  />
                )}
              </View>

              {/* Status (Aberto/Fechado) */}
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusCircle,
                    { backgroundColor: aberto ? "green" : "red" },
                  ]}
                />
                <Text style={styles.statusText}>
                  {aberto ? "Aberto" : "Fechado"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* PARTE DIREITA (Botão WhatsApp) */}
        <TouchableOpacity
          style={styles.whatsappContainer}
          onPress={() => {
            if (item.telefoneResponsavel) {
              Linking.openURL(`https://wa.me/${item.telefoneResponsavel}`);
            }
          }}
        >
          <Ionicons name="logo-whatsapp" size={28} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // 4. Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  // 5. Retorno principal
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bgwhite.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        {/* Saudação */}
        <View style={styles.headerContainer}>
          <Text style={styles.textSaudacao}>Olá, {nomeUsuario}!</Text>
        </View>

        {/* Barra de categorias */}
        <View style={styles.categoriesWrapper}>
          <Text style={styles.filterTitle}>Busque por categoria de serviços</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categoriasPredefinidas.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(cat)}
              >
                <Image
                  source={categoryIcons[cat]}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilterText}>Limpar filtro</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de Mecânicas (filtrada) */}
        <View style={styles.containerMecanicas}>
          <Text style={styles.title}>Mecânicas Cadastradas</Text>
          <FlatList
            data={displayedMecanicas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ====================== ESTILOS ======================
const styles = StyleSheet.create({
  bgImagem: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  /* HEADER */
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  textSaudacao: {
    color: "#32345E",
    fontSize: 18,
    fontWeight: "bold",
  },

  /* BARRA DE CATEGORIAS */
  categoriesWrapper: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#32345E",
  },
  categoriesContainer: {
    paddingVertical: 6,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 4,
    borderRadius: 25, // se quiser icones circulares
    // resizeMode: "contain", // se precisar
  },
  categoryText: {
    fontSize: 12,
    color: "#32345E",
  },
  clearFilterText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: "#C54343",
  },

  /* LISTA DE MECÂNICAS */
  containerMecanicas: {
    flex: 1,
    backgroundColor: "#F4B516",
    marginHorizontal: 20,
    borderRadius: 7,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#32345E",
  },
  list: {
    paddingBottom: 16,
  },

  /* CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    marginVertical: 8,
    marginHorizontal: 10,
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#000",
    overflow: "hidden",
    justifyContent: "center",
    alignSelf: "center",
    marginRight: 8,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", 
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#32345E",
    marginBottom: 4,
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  calendarIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  scheduleText: {
    fontSize: 10,
    color: "#000",
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },

  /* BOTÃO WHATSAPP */
  whatsappContainer: {
    width: 60,
    backgroundColor: "#25D366", // Cor típica do WhatsApp
    justifyContent: "center",
    alignItems: "center",
  },
});
