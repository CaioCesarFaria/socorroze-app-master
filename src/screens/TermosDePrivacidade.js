import React from "react";
import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";

export default function TermosDePrivacidade() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Políticas e Termos de Privacidade</Text>
                <Text style={styles.content}>
                    {/* Conteúdo dos termos de privacidade */}
                    Estes são os termos de privacidade do aplicativo "Socorro Zé".


                    1. Introdução
                    Bem-vindo ao aplicativo "Socorro Zé"! Nosso compromisso é proteger sua privacidade e garantir uma experiência segura e transparente para nossos usuários e parceiros mecânicos. Esta política explica como coletamos, usamos, e protegemos suas informações.

                    2. Coleta de Dados
                    Para proporcionar a melhor experiência, coletamos os seguintes tipos de dados:

                    Informações pessoais: nome, e-mail, número de telefone, etc.
                    Localização: usada para mostrar as mecânicas próximas.
                    Dados do dispositivo: como identificador único, versão do sistema operacional e configurações de rede.
                    3. Uso dos Dados
                    As informações coletadas são usadas para:

                    Localizar mecânicas próximas e oferecer suporte de emergência.
                    Personalizar a experiência do usuário e melhorar a navegação.
                    Gerenciar sua conta e oferecer suporte ao cliente.
                    4. Compartilhamento de Informações
                    Nós não vendemos ou comercializamos informações pessoais. Compartilhamos dados com mecânicas parceiras apenas quando necessário para a prestação do serviço.

                    5. Segurança dos Dados
                    Utilizamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, destruição ou alteração.

                    6. Seus Direitos
                    Os usuários têm o direito de:

                    Acessar e corrigir suas informações.
                    Solicitar a exclusão de dados, exceto onde a retenção é legalmente obrigatória.
                    Alterar as permissões de coleta de dados diretamente nas configurações do dispositivo.
                    7. Alterações na Política
                    Reservamo-nos o direito de modificar esta política de tempos em tempos. Notificaremos sobre quaisquer mudanças significativas.

                    8. Contato
                    Para dúvidas, entre em contato através do nosso e-mail de suporte: [email de contato].
                    {/* Adicione o conteúdo completo do termo aqui */}
                </Text>
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
        fontWeight: "bold",
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        color: "#333",
    },
});
