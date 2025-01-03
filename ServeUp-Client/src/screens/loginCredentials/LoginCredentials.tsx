import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header/Header";
import styles from "./Styles";
import Modal from "react-native-modal";
import { Image } from "react-native";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface CustomAlertProps {
  isVisible: boolean;
  title: string;
  message: string;
  onPress: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ isVisible, title, message, onPress }) => {
  return (
    <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut">
      <View style={styles.alertContainer}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <TouchableOpacity style={styles.alertButton} onPress={onPress}>
          <Text style={styles.alertButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const LoginCredentialsScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    try {
      //get expo push token from async storage
      const expoPushToken = await AsyncStorage.getItem("expoPushToken");

      const response = await fetch(`${config.serverAddress}/api/tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          expoPushToken: expoPushToken
        }),
      });

      if (response.status === 404) {
        showAlert();
      } else if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        // Store the token securely (replace with your storage logic)
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('username', username);
        
        navigation.navigate("BottomStack");
      } else {
        showAlert();
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert();
    }
  };

  return (
    <View style={[styles.container]}>
      <Header />

      <View>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.avatarViewContainer}>
  <View style={styles.avatarContainer}>
    <Image
      source={require("../../../assets/image0.png")}
      style={{ width: 150, height: 150 }} // Adjust the width and height as needed
    />
  </View>
</View>

      <ScrollView style={styles.bodyContainer}>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#8F8F93"
            value={username}
            onChangeText={(text) => setUsername(text)}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputField}>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8F8F93"
            value={password}
            onChangeText={(text) => setPassword(text)}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomAlert
        isVisible={isAlertVisible}
        title="Incorrect Login"
        message="Username or password is incorrect."
        onPress={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default LoginCredentialsScreen;
