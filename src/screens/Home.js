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
  Alert,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import app from "../firebase-config/firebasecofing";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import "moment/locale/pt-br";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import * as Location from "expo-location";
import { haversineDistance } from "../utils/geoUtils";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const calendarIcon = require("../../assets/icons/icon_calendar.png");
const categoryIcons = {
  Mecânica: require("../../assets/icons/icon_mecanica.png"),
  Elétrica: require("../../assets/icons/icon_eletrica.png"),
  Lanternagem: require("../../assets/icons/icon_lanternagem.png"),
  Guincho: require("../../assets/icons/icon_guincho.png"),
  Borracharia: require("../../assets/icons/icon_borracharia.png"),
  Pintura: require("../../assets/icons/icon_pintura.png"),
  Revisão: require("../../assets/icons/icon_revisao.png"),
};
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


export default function Home() {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [nomeUsuario, setNomeUsuario] = useState("");
  const [userRole, setUserRole] = useState("");
  const [mecanicas, setMecanicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer logout.");
    }
  };

  const fetchUsuario = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role || "user";
          const cidades = userDoc.data().cidadesResponsaveis || [];
          setNomeUsuario(userDoc.data().nome);
          setUserRole(role);
          setCidadesAdmin(cidades);
          if (cidades.length > 0) setCidadeSelecionada(cidades[0]);
          console.log("Role do usuário:", role);
        }
      }
    } catch (error) {
      console.log("Usuário autenticado, mas documento do Firestore ainda não existe.");
    }
  };

  const fetchMecanicas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mecanicas"));
      const mecanicasList = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((mecanica) => mecanica.ativo !== false);
      setMecanicas(mecanicasList);
    } catch (error) {
      console.error("Erro ao buscar mecânicas:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    Alert.alert(
      "Precisamos da sua localização",
      "Vamos usar sua localização para encontrar mecânicas próximas de você. Deseja continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Permitir",
          onPress: async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setLocationError("Permissão de localização negada");
              Alert.alert("Erro", "Permissão de localização negada.");
              return;
            }
  
            const location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
          },
        },
      ]
    );
  };
  

  useEffect(() => {
    getLocation();
    fetchUsuario();
    fetchMecanicas();
  }, []);

  const isMechanicOpen = (diasFuncionamento, eh24Horas) => {
    if (eh24Horas) return true; // Se for 24h, sempre retorna true
    if (!diasFuncionamento) return false;
    const currentDay = moment().day();
    const currentTimeStr = moment().format("HH:mm");
    const format = "HH:mm";

    const dayData = diasFuncionamento[currentDay];
    if (!dayData || !dayData.aberto) return false;

    const now = moment(currentTimeStr, format);
    const start = moment(dayData.abertura, format);
    const end = moment(dayData.fechamento, format);
    return now.isBetween(start, end, null, "[]");
  };

  const getScheduleText = (diasFuncionamento) => {
    if (!diasFuncionamento) return "";
    const openDays = [];
    for (let i = 0; i < 7; i++) {
      if (diasFuncionamento[i]?.aberto) openDays.push(i);
    }

    const today = moment().day();
    const todayData = diasFuncionamento[today];
    if (openDays.length === 7) {
      return todayData?.aberto
        ? `Aberto todos os dias: ${todayData.abertura} - ${todayData.fechamento}`
        : "Aberto todos os dias (Hoje fechado)";
    }

    const isMonFri =
      [1, 2, 3, 4, 5].every((d) => openDays.includes(d)) &&
      openDays.length === 5;
    const isMonSat =
      [1, 2, 3, 4, 5, 6].every((d) => openDays.includes(d)) &&
      openDays.length === 6;

    if (isMonSat) {
      return todayData?.aberto
        ? `Seg-Sáb: ${todayData.abertura} - ${todayData.fechamento}`
        : "Seg-Sáb (Hoje fechado)";
    } else if (isMonFri) {
      return todayData?.aberto
        ? `Seg-Sex: ${todayData.abertura} - ${todayData.fechamento}`
        : "Seg-Sex (Hoje fechado)";
    } else {
      return todayData?.aberto
        ? `Hoje: ${todayData.abertura} - ${todayData.fechamento}`
        : "Hoje fechado";
    }
  };

  const displayedMecanicas = useMemo(() => {
    let result = [...mecanicas];
    if (selectedCategory) {
      result = result.filter((m) => m.categorias?.includes(selectedCategory));
    }
    result.sort((a, b) => a.nomeFantasia.localeCompare(b.nomeFantasia));
    return result;
  }, [mecanicas, selectedCategory]);

  const formatDistance = (distance) => {
    if (!distance) return "---";
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1).replace(".", ",")}km`;
  };

  const renderItem = ({ item }) => {
    const aberto = isMechanicOpen(item.diasFuncionamento, item.eh24Horas);
    const scheduleText = getScheduleText(item.diasFuncionamento);

    let distance = null;
    if (userLocation && item.latitude && item.longitude) {
      distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude
      );
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Details", { id: item.id })}
      >
        <View style={styles.leftContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={
                item.selectedImage
                  ? { uri: item.selectedImage }
                  : require("../../assets/logopadrao.png")
              }
              style={styles.coverImage}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.cardTitle}>{item.nomeFantasia}</Text>
            <View style={styles.calendarContainer}>
              <Image source={calendarIcon} style={styles.calendarIcon} />
              <Text style={styles.scheduleText}>{scheduleText}</Text>
            </View>

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
                  <Ionicons name="bicycle-outline" size={20} color="#C54343" />
                )}
              </View>
              <View style={styles.distanceRow}>
                <Entypo name="location-pin" size={20} color="green" />
                <Text style={styles.distanceText}>
                  {formatDistance(distance)}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusCircle,
                    {
                      backgroundColor:
                        aberto || item.eh24Horas ? "green" : "red",
                    },
                  ]}
                />
                <Text style={styles.statusText}>
                  {aberto ? "Aberto" : "Fechado"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.whatsappContainer}
          onPress={() => {
            if (item.telefone) {
              abrirWhatsApp(item.telefone, item.nomeFantasia);
            } else {
              Alert.alert("Aviso", "Telefone não disponível!");
            }
          }}
        >
          <Ionicons name="logo-whatsapp" size={28} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#32345e" />
      <ImageBackground
        source={require("../../assets/bgwhite.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          {/* ✅ Botão que apenas "admin" e "master" podem ver */}
        {userRole === "admin" || userRole === "master" ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeAdm")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backButtonText}>
              Voltar para HomeAdm
            </Text>
          </TouchableOpacity>
        ) : null}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="exit-outline" size={28} color="#C54343" />
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
          <Text style={styles.textSaudacao}>Olá, {nomeUsuario}!</Text>
        </View>

        <View style={styles.categoriesWrapper}>
          <Text style={styles.filterTitle}>
            Busque por categoria de serviços
          </Text>
          <View style={styles.categoriesWrapperBox}>
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
          </View>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilterText}>Limpar filtro</Text>
            </TouchableOpacity>
          )}
        </View>

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

const styles = StyleSheet.create({
  bgImagem: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection:'column',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
    gap: 6,
  },
  logoutButtonText: {
    fontSize: 14,
    color: "#32345E",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    marginBottom: 10,
  },
  
  backButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 5,
  },
  textSaudacao: {
    color: "#32345E",
    fontSize: 18,
    fontWeight: "bold",
  },
  categoriesWrapper: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  categoriesWrapperBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 10,
    overflow: "hidden",
  },  
  filterTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: "#32345E",
    textAlign: "center",
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 4,
    borderRadius: 25,
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
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    marginVertical: 8,
    marginHorizontal: 10,
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
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 5,
  },
  distanceText: {
    color: "black",
    fontSize: 12,
    fontWeight: "500",
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
  whatsappContainer: {
    width: 50,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
  },
});
