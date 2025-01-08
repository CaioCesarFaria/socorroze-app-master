import React from "react";

import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function EsqueciSenha() {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView>
      <ImageBackground
        source={require("../../assets/bgfull.png")}
        style={styles.bgImagem}
        resizeMode="cover"
      >
        
      </ImageBackground>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  bgImagem: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
