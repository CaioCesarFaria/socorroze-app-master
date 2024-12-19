import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { 
    StyleSheet, 
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Image
} from "react-native";

export default function Welcome(){

    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto"/>
            <Image style={styles.logoWelcome} source={require("../../assets/icon_tools.png")}></Image>
            <Text style={styles.titleWelcome}>Olá, seja bem-vindo ao Socorro zé!</Text>
            <Text style={styles.subtitleWelcome}>Todos os serviços mecânicos em um só lugar</Text>
            <TouchableOpacity 
            style={styles.buttonInicio}
            onPress={()=> navigation.navigate('Cadastro')}
            >
                <Text style={styles.buttonInicioText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.buttonInicio}
            onPress={()=> navigation.navigate('Login')}
            >
                <Text style={styles.buttonInicioText}>Entrar</Text>
            </TouchableOpacity>
            <View style={styles.containerPrivacidade}> 
            <TouchableOpacity style={styles.buttonPrivacidade}
            onPress={() => navigation.navigate('TermosDePrivacidade')}>
                <Text style={styles.buttonPrivacidadeText}>Políticas e Termos de Privacidade</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:'center',
        backgroundColor:"#f4b516"
        
    },
    logoWelcome: {
        width:100,
        resizeMode:'contain'
    },
    titleWelcome:{
        
        color:"#27294A",
        marginTop:10,
        marginBottom:80,
        fontSize:26,
        textAlign:'center',
        fontWeight:'bold'
    },
    subtitleWelcome: {
        color:"#27294A",
        marginTop:20,
        marginBottom:40,
        fontSize:18,
        textAlign:'center'
    },
    buttonInicio: {
        backgroundColor:"#803B3B",
        color:"#000",
        width:200,
        fontSize:24,
        paddingHorizontal:2,
        paddingVertical:3,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:30,
        borderRadius:12,

    },
    buttonInicioText: {
        fontSize:20,
        color:"#fff"

    },
    buttonPrivacidadeText: {
        color:"#27294A"
    }

})