import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TermosDePrivacidade() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#32345e" />

      {/* ✅ Botão de Voltar no topo */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#34325e" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Políticas e Termos de Privacidade</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introdução</Text>
          <Text style={styles.content}>
            Bem-vindo ao aplicativo <Text style={styles.bold}>AUTOZAP</Text>! Nosso compromisso é 
            proteger sua privacidade e garantir uma experiência segura e transparente. 
            Esta política explica como coletamos, usamos e protegemos suas informações.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Coleta de Dados</Text>
          <Text style={styles.content}>
            Para proporcionar a melhor experiência, coletamos os seguintes tipos de dados:
          </Text>
          <Text style={styles.listItem}>• <Text style={styles.bold}>Informações pessoais:</Text> nome, e-mail, telefone, etc.</Text>
          <Text style={styles.listItem}>• <Text style={styles.bold}>Localização:</Text> usada para mostrar as mecânicas próximas.</Text>
          <Text style={styles.listItem}>• <Text style={styles.bold}>Dados do dispositivo:</Text> identificador único, sistema operacional e configurações de rede.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Uso dos Dados</Text>
          <Text style={styles.content}>
            As informações coletadas são usadas para:
          </Text>
          <Text style={styles.listItem}>• Localizar mecânicas próximas e oferecer suporte de emergência.</Text>
          <Text style={styles.listItem}>• Personalizar a experiência do usuário e melhorar a navegação.</Text>
          <Text style={styles.listItem}>• Gerenciar sua conta e oferecer suporte ao cliente.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Compartilhamento de Informações</Text>
          <Text style={styles.content}>
            Nós <Text style={styles.bold}>não vendemos</Text> ou comercializamos informações pessoais. 
            Compartilhamos dados com mecânicas parceiras apenas quando necessário para a prestação do serviço.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Segurança dos Dados</Text>
          <Text style={styles.content}>
            Utilizamos medidas técnicas e organizacionais para proteger suas informações 
            contra acesso não autorizado, destruição ou alteração.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Seus Direitos</Text>
          <Text style={styles.content}>Os usuários têm o direito de:</Text>
          <Text style={styles.listItem}>• Acessar e corrigir suas informações.</Text>
          <Text style={styles.listItem}>• Solicitar a exclusão de dados (exceto onde a retenção for obrigatória).</Text>
          <Text style={styles.listItem}>• Alterar permissões de coleta de dados nas configurações do dispositivo.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Alterações na Política</Text>
          <Text style={styles.content}>
            Podemos modificar esta política de tempos em tempos. 
            Notificaremos sobre quaisquer mudanças significativas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contato</Text>
          <Text style={styles.content}>
            Para dúvidas, entre em contato pelo nosso e-mail de suporte: <Text style={styles.bold}>[email de contato]</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4b516",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Ajuste para evitar sobreposição
  },
  scrollContainer: {
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    
    
    
    
  },
  backButtonText: {
    fontSize: 16,
    color: "#34325e",
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27294A",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#32345E",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: "#333",
    textAlign: "justify",
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
  },
});

