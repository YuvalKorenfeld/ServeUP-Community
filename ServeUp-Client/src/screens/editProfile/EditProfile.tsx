import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Dimensions,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./Styles";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";
import { Image } from "react-native";
import Header from "../../components/header/Header";
import Wrapper from "../../components/wrapper/Wrapper";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChooseImageAlert from "./chooseImageAlert/chooseImageAlert";
const { width, height } = Dimensions.get("window");
const OS = Platform.OS;
const CircleLength = OS == "android" ? height * 0.73 : height * 0.54;

const Radius = CircleLength / (2 * Math.PI);
const MemoizedTextInput = React.memo((props) => <TextInput {...props} />);

const EditProfileScreen = ({ navigation, route }: any) => {
  const {
    username,
    displayName: initialDisplayName,
    bio: initialBio,
    location: initialLocation,
    complementaryValue,
  } = route.params;

  const circularProgress = useSharedValue(1);
  const [bio, setBio] = useState(initialBio);
  const [location, setLocation] = useState(initialLocation);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [newImageUri, setNewImageUri] = useState("");
  const [initialRender, setInitialRender] = useState(true); // Use state hook
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CircleLength * circularProgress.value,
  }));
  const getImageSource = async () => {
    if (newImageUri) {
      return newImageUri;
    } else {
      // Get the URL from AsyncStorage
      const url = await AsyncStorage.getItem('userProfilePicSrc');
      return url || '../../../assets/userProfilePic.png';
    }
  };
  const [url, setUrl] = React.useState(null);
  useEffect(() => {
    getImageSource().then((url) => setUrl(url));
  }, []);
  useEffect(() => {
    if (initialRender) {
      circularProgress.value = withTiming(complementaryValue, {
        duration: 3000,
      });
      setInitialRender(false); 
      return;
    }
    circularProgress.value = withTiming(complementaryValue, { duration: 0.00000000001 });
    return () => {
     circularProgress.value = 1;
    };
  }, [bio, location, displayName]);


  useFocusEffect(
    React.useCallback(() => {
        setTimeout(() => {
          circularProgress.value = withTiming(complementaryValue, { duration: 3000 });
        }, 300);
      
      return () => {
        // Cleanup function
        circularProgress.value = 1;
      };
    }, [])
  );
  const [isAlertVisible, setAlertVisible] = useState(false);
  const handleImageClick = () => {
  setAlertVisible(true);
  }

  const handleSubmitChanges = async () => {
    try {
      const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
      const username = await AsyncStorage.getItem("username");
      const endpoint = `${config.serverAddress}/api/Users/`;

      const updatedFields = {
        displayName,
        bio,
        location,
      };
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          bio: bio,
          location: {
            name: location,
          },
          displayName: displayName,
        }),
      });

      if (response.ok) {
        navigation.navigate("ProfileScreen");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error while updating profile:", error);
    }
  };

  return (
    <View style={[styles.container]}>
      <Header />
      <TouchableWithoutFeedback
        onPress={()=>{handleImageClick()}}
        >
      <Svg style={styles.svgView}>
        <AnimatedCircle
          cx={"50%"}
          cy={"51%"}
          r={Radius}
          strokeWidth={10}
          stroke="#D5FF45"
          strokeDasharray={CircleLength}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
        <Image
          key={newImageUri} // Add key prop here
          style={{
            //position: 'absolute',
            top: '17.5%',
            left: '31%',
            width: '85%',
            height: '85%',
            borderRadius: 200, // assuming you want a circular image
            aspectRatio: 1, // so image will not change its aspect
            overflow: 'hidden', // hide the overflowing image from displaying
          }}
          source={
            newImageUri
              ? { uri: newImageUri }
              : {uri:url}
          }
        />
        
      </Svg>
      </TouchableWithoutFeedback>
      <Wrapper style={{ flex: 1 }}>
        <View style={styles.mainView}>
          <View style={styles.inputField}>
            <TextInput
              value={displayName}
              onChangeText={(text) => setDisplayName(text)}
              style={styles.input}
              placeholder="Region"
              placeholderTextColor="#8F8F93"
            />
          </View>
          <View style={styles.inputField}>
            <MemoizedTextInput
              value={location}
              onChangeText={(text) => setLocation(text)}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8F8F93"
            />
          </View>
          <View style={styles.multiLineInputField}>
            <MemoizedTextInput
              multiline
              value={bio}
              onChangeText={(text) => setBio(text)}
              style={styles.input}
              placeholder="Bio"
              placeholderTextColor="#8F8F93"
            />
          </View>
        </View>
      </Wrapper>
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitChanges}>
        <Text style={styles.submitBtnText}>Submit Changes</Text>
      </TouchableOpacity>
      <ChooseImageAlert
      isVisible={isAlertVisible}
      setNewImageUri={setNewImageUri}
      onPress={() => setAlertVisible(false)}
      ></ChooseImageAlert>
    </View>
  );
};

export default EditProfileScreen;
