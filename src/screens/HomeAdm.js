import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { auth } from '../firebase-config/firebasecofing';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";


export default function HomeAdm() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (userAuth) => {
          if (userAuth) {
            setUser(userAuth);
            const db = getFirestore();
            const userRef = doc(db, 'usuarios', userAuth.uid);
            const docSnap = await getDoc(userRef);
      
            if (docSnap.exists()) {
              setUserData(docSnap.data());
            } else {
              console.log('No such document!');
            }
          } else {
            navigation.navigate('Login'); // Redireciona para a tela de login
          }
        });
      
        return () => unsubscribeAuth();
      }, []);
    return (
        <SafeAreaView>
            <Text>
                {user ? `Olá, ${user.displayName || userData?.nome || 'Usuário'}` : 'Você não está logado'}
            </Text>
            
            <TouchableOpacity style={styles.btnNewClient} onPress={()=> navigation.navigate('NewClient')}>
                <Text style={styles.buttonText}>Cadastrar Novo Cliente</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})