import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Header from "../../components/header/Header";
import styles from "./Styles";
import { useEffect } from "react";
import config from "../../../helpers/config";

const Wrapper = ({ children, style }) => {
  const [childHeight, setChildHeight] = useState<any>(500);
  const [screenHeight, setScreenHight] = useState<any>(
    Dimensions.get("window").height - 200
  );

  const WrapperView = childHeight > screenHeight ? ScrollView : View;
  return (
    <WrapperView style={{ ...style }}>
      <View>{children}</View>
    </WrapperView>
  );
};

const SignupContinueScreen = ({ route, navigation }: any) => {
  const { username, displayName, city, password, adminCode, profilePic , age} = route.params;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const isSignupButtonClickable = selectedImage !== null;


  const imageSources = {
    1: require("../../../assets/bg_1.png"),
    2: require("../../../assets/bg_2.png"),
    3: require("../../../assets/bg_3.png"),
    4: require("../../../assets/bg_4.png"),
    5: require("../../../assets/bg_5.png"),
    6: require("../../../assets/bg_6.png"),
  };

  const CreateUser = async (real_level) => {
    try {
      // Define the user data to be sent in the request body
      const userData = {
        username,
        password,
        displayName,
        profilePic,
        age,
        level: {
          number: 0,  // Adjust the default value as needed
          percentage: 0,  // Adjust the default value as needed
        },
        bio: '',  // Add the bio field if it is part of your user data
        location: {
          name: city,
          adminCode: adminCode,
        },
        friends: [],  // Assuming friends is an array of ObjectIds
        realLevel: parseInt(real_level) - 1,
      };
      // Make the POST request to the server
      const response = await fetch(`${config.serverAddress}/api/Users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        // The user has been created successfully
        // Navigate to the BottomStack or any other screen as needed
        navigation.navigate('LoginCredentialsScreen');
      } else {
        // Handle errors
        console.error('Error creating user:', response.status, response.statusText);
      }
    } catch (e) {
      console.error('Error creating user:', e);
    }
  };
  

  const getTitleForImage = (imageKey) => {
    switch (imageKey) {
      case 1:
        return "Fresh";
      case 2:
        return "Rising";
      case 3:
        return "Fearless";
      case 4:
        return "Smasher";
      case 5:
        return "Elite";
      case 6:
        return "Legend";
      default:
        return "";
    }
  };

  const getDescriptionForImage = (imageKey) => {
    switch (imageKey) {
      case 1:
        return "Just started - less than 6 months on the court, playing occasionally";
      case 2:
        return "6 months to 1 year of experience, hitting the court monthly, mastering the basics";
      case 3:
        return "1-2 years in, weekly plays, honing skills in spirited rallies";
      case 4:
        return "With 2-3 years under the belt, I hit the court weekly, refining my baseline game";
      case 5:
        return "3-4 years of experience, frequent play several times a week, mastering the serve and volley";
      case 6:
        return "Over 5 years dedicated to the game, practically live on the court, competing at a near-daily, professional level";
      default:
        return "";
    }
  };

  const handleImagePress = (imageKey) => {
    setSelectedImage(imageKey);
  };

  return (
    <View style={[styles.container]}>
      <Header />

      <View>
        <Text style={styles.title}>Signup</Text>
        <Text style={styles.desp}>Choose your tennis level</Text>
      </View>

      <Wrapper style={styles.bodyContainer}>
        <View style={styles.mainView}>
          {[1, 2, 3, 4, 5, 6].map((imageKey) => (
            <TouchableOpacity
              key={imageKey}
              onPress={() => handleImagePress(imageKey)}
              style={[
                styles.bg,
                selectedImage === imageKey && styles.selectedImage,
              ]}
            >
              <ImageBackground
                style={styles.bg}
                source={imageSources[imageKey]}
              >
                <View style={styles.transparentView}>
                  <Text style={styles.cardTitle}>
                    {getTitleForImage(imageKey)}
                  </Text>
                  <Text style={styles.cardDesp}>
                    {getDescriptionForImage(imageKey)}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </Wrapper>

 {isSignupButtonClickable ? (
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => CreateUser(selectedImage.toString())}
        >
          <Text style={styles.signupBtnText}>Signup</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.signupBtn, { backgroundColor: "#777777" }]}>
          <Text style={[styles.signupBtnText, { color: "#333333" }]}>
            Choose Your Level
          </Text>
        </View>
      )}
    </View>
  );
};

export default SignupContinueScreen;
