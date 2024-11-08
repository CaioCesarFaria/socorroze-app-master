import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { auth } from '../firebase-config/firebasecofing'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth); 

        // Acesso ao Firestore para pegar dados adicionais do usuário
        const db = getFirestore(); // Instancia o Firestore
        const userRef = doc(db, 'usuarios', userAuth.uid); 
        const docSnap = await getDoc(userRef); 

        if (docSnap.exists()) {
          setUserData(docSnap.data()); 
        } else {
          console.log('No such document!');
        }
      } else {
        setUser(null); // Caso não esteja logado, limpa o estado do usuário
        setUserData(null); // Limpa os dados do usuário
      }
    });

    // Limpeza do listener ao desmontar o componente
    return () => unsubscribeAuth();
  }, []);

  return (
    <View>
      <Text>
        {user ? `Olá, ${user.displayName || userData?.nome || 'Usuário'}` : 'Você não está logado'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})