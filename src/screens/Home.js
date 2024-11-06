import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import app from '../firebase-config/firebasecofing'; 

export default function Home() {

  return (
    <SafeAreaView style={styles?.container}>
      <View>
        <Text>Olá,</Text>
        <Text>{name || ''}</Text>
      </View>
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