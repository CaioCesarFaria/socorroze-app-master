import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const slides = [
  {
    id: 1,
    title: "Bem-vindo ao Socorro Zé!",
    description: "Aqui você encontra mecânicos próximos para te ajudar a qualquer momento.",
    image: require("../../assets/tutorial_1.png"),
  },
  {
    id: 2,
    title: "Como Funciona?",
    description: " Permita sua localização para visualizar os mecânicos mais próximos de você.",
    image: require("../../assets/tutorial_2.png"),
    
  },
  {
    id: 3,
    title: "Entre em Contato",
    description: "Toque em uma mecânica para ver os detalhes e falar direto pelo WhatsApp.",
    image: require("../../assets/tutorial_3.png"),
    
  },
  {
    id: 4,
    title: "Avaliações em Breve",
    description: "Em breve, você poderá avaliar mecânicas e ajudar outros usuários!",
    image: require("../../assets/tutorial_4.png"),
    
  },
  {
    id: 5,
    title: "Vamos começar?",
    description: "Agora que você sabe tudo, vamos lá!",
    image: require("../../assets/tutorial_5.png"),
  },
];

export default function Tutorial() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Avança para o próximo slide
  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem("@tutorialVisto", "true");
      navigation.replace("Welcome"); // Direciona para a home após o tutorial
    }
  };

  // Pula o tutorial direto para a home
  const handleSkip = async () => {
    await AsyncStorage.setItem("@tutorialVisto", "true");
    navigation.replace("Welcome");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{slides[currentIndex].title}</Text>
      <Text style={styles.description}>{slides[currentIndex].description}</Text>
      <Image source={slides[currentIndex].image} style={styles.image} />
      

      <View style={styles.buttonContainer}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Pular</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? "Começar" : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#32345E",
    marginTop: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  skipButton: {
    backgroundColor: "#C54343",
    padding: 12,
    borderRadius: 8,
  },
  skipButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth:1,
    borderColor: "#c54343"
  },
  nextButtonText: {
    color: "#C54343",
    fontSize: 16,
    fontWeight: "bold",
  },
});
