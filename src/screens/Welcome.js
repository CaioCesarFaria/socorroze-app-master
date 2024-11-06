import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { 
    StyleSheet, 
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Welcome(){

    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto"/>
            <Text style={styles.titleWelcome}>Olá, seja bem-vindo ao Socorro zé!</Text>
            
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
            <TouchableOpacity style={styles.buttonPrivacidade}>
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
        justifyContent:'flex-start'
        
    },
    titleWelcome:{
        
        color:"#000",
        marginTop:40,
        marginBottom:40,
        fontSize:26,
        textAlign:'center'
    },
    buttonInicio: {
        backgroundColor:"#b3b3b3",
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

    }

})