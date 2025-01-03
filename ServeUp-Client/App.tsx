import * as React from "react";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";

import RootNavigator from "./navigation/RootNavigator";
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontFamily: "regular" }}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

const MyStatusBar = ({ backgroundColor, ...props }: any) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

function App() {
  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Sf-pro-rounded-regular.ttf"),
    medium: require("./assets/fonts/SF-Pro-Rounded-Medium.otf"),
    bold: require("./assets/fonts/SF-Pro-Rounded-Bold.otf"),
    semiBold: require("./assets/fonts/SF-Pro-Rounded-Semibold.otf"),
    displayMedium: require("./assets/fonts/SF-Pro-Display-Medium.otf"),
    displayBold: require("./assets/fonts/SF-Pro-Display-Bold.otf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (fontsLoaded) {
        // Request permission for notifications
        const status = await Notifications.requestPermissionsAsync();
        
        if (status.granted) {
          // Get Expo Push Token after permission is granted
          const expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId: '98c7e94c-c4db-4da4-8cca-1e20028e2512' });
  
          if (expoPushToken) {
            const expoToken = expoPushToken.data;
  
            try {
              await AsyncStorage.setItem("expoPushToken", expoToken);
            } catch (error) {
              console.error("Error storing token:", error);
            }
          } else {
            // Handle the case where it is not possible to get a token
            await AsyncStorage.setItem("expoPushToken", "");
          }
        } else {
          // Handle the case where permission is not granted
          console.warn("Permission for notifications denied");
          await AsyncStorage.setItem("expoPushToken", "");
        }
      }
    };
  
    fetchData();
  }, [fontsLoaded]);
  
  

  if (!fontsLoaded) {
    return;
  }

  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor={"#162529"} barStyle={"light-content"} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <RootNavigator />
      </SafeAreaView>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: "red",
  },

  title: {
    fontSize: 30,
    textAlign: "center",
    // fontFamily: Fonts.type.bold,
  },

  bottomNotch: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
