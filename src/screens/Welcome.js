import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { 
    StyleSheet, 
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Image,
    ImageBackground
} from "react-native";

export default function Welcome(){

    const navigation = useNavigation();
    return(
        <ImageBackground
        source={require("../../assets/bgfull.png")}
        style={styles.bgImagem}
        resizeMode="cover"
        >
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto"/>
            <Image style={styles.logoWelcome} source={require("../../assets/iconlogo.png")}></Image>
            <View style={styles.boxText}>
            <Text style={styles.titleWelcome}>Olá, seja bem-vindo ao Socorro zé!</Text>
            <Text style={styles.subtitleWelcome}>Todos os serviços mecânicos em um só lugar</Text>
            </View>
            <TouchableOpacity 
            style={styles.buttonCadastro}
            onPress={()=> navigation.navigate('Cadastro')}
            >
                <Text style={styles.buttonCadastroText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.buttonEntrar}
            onPress={()=> navigation.navigate('Login')}
            >
                <Text style={styles.buttonEntrarText}>Entrar</Text>
            </TouchableOpacity>
            <View style={styles.containerPrivacidade}> 
            <TouchableOpacity style={styles.buttonPrivacidade}
            onPress={() => navigation.navigate('TermosDePrivacidade')}>
                <Text style={styles.buttonPrivacidadeText}>Políticas e Termos de Privacidade</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    bgImagem: {
        flex:1,
        width: "100%",
        height: "100%",
    },
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:'center',
        
        
    },
    logoWelcome: {
        width:150,
        resizeMode:'contain'
    },
    boxText:{
        flexDirection:'column',

    },
    titleWelcome:{
        
        color:"#27294A",
        marginTop:10,
        marginBottom:10,
        fontSize:26,
        textAlign:'center',
        fontWeight:'bold'
    },
    subtitleWelcome: {
        color:"#27294A",
        marginTop:20,
        marginBottom:40,
        fontSize:16,
        textAlign:'center',
        paddingHorizontal:'10%'
    },
    buttonCadastro: {
        backgroundColor:"#C54343",
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
    buttonEntrar: {
        backgroundColor:"#FFFFFF",
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
    buttonCadastroText: {
        fontSize:20,
        color:"#fff",
        fontWeight:'bold'

    },
    buttonEntrarText: {
        fontSize:20,
        color:"#C54343",
        fontWeight:'bold'

    },
    buttonPrivacidadeText: {
        color:"#C54343",
        fontStyle:'italic'
    }

})