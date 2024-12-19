import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default  function SplashScreen(){
    return (
        <View style={styles.container}>
          <Image 
            source={require('../../assets/splashok.png')} 
            style={styles.image} 
          />
        </View>
      )
}
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
  },
  image: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover', 
  },
});

