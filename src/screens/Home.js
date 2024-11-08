import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../firebase-config/firebasecofing'; 
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 

export default function Home() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [mechanics, setMechanics] = useState([]); // Novo estado para armazenar mecânicas
  
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

    // Função para buscar as mecânicas cadastradas no Firestore
    const fetchMechanics = async () => {
      const db = getFirestore();
      const mechanicsCollection = collection(db, 'mecanicas');
      const mechanicsSnapshot = await getDocs(mechanicsCollection);
      const mechanicsList = mechanicsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMechanics(mechanicsList); // Define a lista de mecânicas no estado
    };

    fetchMechanics(); // Chama a função para buscar as mecânicas

    // Limpeza do listener ao desmontar o componente
    return () => unsubscribeAuth();
  }, []);

  // Renderiza cada card de mecânica
  const renderMechanicCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nomeFantasia}</Text>

      {/* Ícones de veículo */}
      <View style={styles.iconContainer}>
        {item.atendeMoto && <Icon name="bicycle-outline" size={24} color="black" />} 
        {item.atendeCarro && <Icon name="car-outline" size={24} color="black" />} 
      </View>

      {/* Indicador de 24 horas */}
      <View style={[styles.statusIndicator, { backgroundColor: item.is24Hours ? 'green' : 'red' }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {user ? `Olá, ${user.displayName || userData?.nome || 'Usuário'}` : 'Você não está logado'}
      </Text>
      
      <Text style={styles.title}>Mecânicas Cadastradas</Text>

      {/* Lista de mecânicas */}
      <FlatList
        data={mechanics}
        keyExtractor={(item) => item.id}
        renderItem={renderMechanicCard}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
});
