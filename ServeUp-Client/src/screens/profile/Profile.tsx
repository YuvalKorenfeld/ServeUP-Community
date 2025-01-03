import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Dimensions,
  // Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Dots from "../../../assets/dots.svg";
import styles from "./Styles";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";
import {Image} from "react-native";
import config from "../../../helpers/config";
import levelOptions from "../../../helpers/levelOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPlayerBG } from "../../../helpers/getters";
const OS = Platform.OS;
const CircleLength = 500;
const Radius = CircleLength / (2 * Math.PI);

const Wrapper = ({ children, style = {} }) => {
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

const ProfileScreen = ({ navigation }: any) => {
  const circularProgress = useSharedValue(1);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CircleLength * circularProgress.value,
  }));
  const [userData, setUserData] = useState(null);
  const [friendsData, setFriendsData] = useState(null);

 let complementaryValue = null
 const fetchData = async () => {
  try {
    const token =await AsyncStorage.getItem("userToken"); // Replace with your actual access token
    const username =await AsyncStorage.getItem("username"); // Replace with your actual username

    const response = await fetch(`${config.serverAddress}/api/Users/${username}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const friendsResponse = await fetch(`${config.serverAddress}/api/Users/friends`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUserData(data);
      AsyncStorage.setItem("userProfilePicSrc", data.profilePic);
      AsyncStorage.setItem("UserId", data._id);
      if (friendsResponse.ok) {
        const friendsData = await friendsResponse.json();

        setFriendsData(friendsData);
      } else {
        console.error("Failed to fetch user data");
      }

      setTimeout(() => {
        const complementaryValue = 1 - (data.level?.percentage || 0) / 100;
        circularProgress.value = withTiming(complementaryValue, { duration: 3000 });
      }, 300);
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error while fetching user data:", error.message);
  }
};
  useEffect(() => {

        // Fetch user data from the serv
    
        fetchData();
    return () => {
      circularProgress.value = 1;
    };
  }, []);
 
  useFocusEffect(
    React.useCallback(() => {
      // Check if userData is available
      fetchData();
      
      if (userData) {
        // Introduce a 1-second delay before updating circularProgress
        setTimeout(() => {
          const complementaryValue = 1 - (userData.level?.percentage || 0) / 100;
          circularProgress.value = withTiming(complementaryValue, { duration: 3000 });
        }, 300);
      }
  
      return () => {
        // Cleanup function
        circularProgress.value = 1;
      };
    }, [])
  );
  

  let s = {
    height: "50%",
  };

  const handleLogout = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const token = await AsyncStorage.getItem("userToken");

      //send to server to remove the token
      const response = await fetch(`${config.serverAddress}/api/Users/${username}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error("Error while logging out:", response.status, response.statusText);
      }
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("username");
      //expo token will always be the same, just delete for the user in the db
      navigation.navigate("LoginCredentialsScreen");
    } catch (error) {
      console.error("Error while logging out:", error.message);
    }
  }


  return (
    <View style={[styles.container]}>
      <View>
      <TouchableOpacity
        style={styles.historyBtn2}
        onPress={handleLogout}>
        <Text style={styles.historyBtnText}>Logout</Text>
      </TouchableOpacity>
        <ImageBackground
          imageStyle={{ borderRadius: 20 }}
          style={{
            height: 196,
            width: "100%",
            marginTop: "5%",
          }}
          source={getPlayerBG(userData?.level?.number || 0)}
        >
          <Svg
            style={{
              marginTop: "20%",
              // backgroundColor: "red",
              height: "100%",
              width: "100%",
            }}
          >
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
             style={{
              top: '16%',
              left: '31%',
              width: '78%',
              height: '78%',
              borderRadius: 200, // assuming you want a circular image
              aspectRatio: 1, // so image will not change it's aspect
              overflow: 'hidden', // hide the overflowing image from displaying
            
             }}
             source={ (userData&&userData.profilePic)? 
              {uri: userData.profilePic}
              :
              require("../../../assets/userProfilePic.png")
             }
            />
          
           
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: OS == "android" ? "8%" : "7.5%",
              }}
            >
            </View>
          </Svg>
        </ImageBackground>
      </View>

      <Wrapper style={{ zIndex: -1 }}>
        <View style={styles.infoContainer}>
        <Text numberOfLines={1} style={styles.nameText}>
        {userData ? userData.displayName : 'Loading...'}
      </Text>

          <View style={styles.despContainer}>
            <Text numberOfLines={1} style={styles.despText}>
            {userData && userData.location ? userData.location.name : 'Loading...'} |
            </Text>
            <Text numberOfLines={1} style={styles.expLevel}>
            {userData ? " " + levelOptions[userData.level.number] + " " +  userData.level.percentage + "%"|| 'Unknown Level' : 'Loading...'}
            </Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => {
              navigation.navigate("GameHistoryScreen");
            }}
          >
            <Text style={styles.historyBtnText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyBtn3}
            onPress={() => {
              navigation.navigate("MyFriendsScreen");
            }}
          >
            <Text style={styles.friendsBtnText}>Friends</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => {
              navigation.navigate("MyLeagueScreen");
            }}
          >
            <Text style={styles.historyBtnText}>League</Text>
          </TouchableOpacity> 

          <TouchableOpacity
            style={styles.editBtn}
          
            onPress={() => {
              // Check if userData is available
              if (userData) {
                navigation.navigate("EditProfileScreen", {
                  // Pass user data to the "EditProfileScreen"
                  username: userData.username, // Replace with the actual username
                  displayName: userData.displayName,
                  bio: userData.bio,
                  location: userData.location.name,
                  complementaryValue: 1 - (userData.level?.percentage || 0) / 100,
                });
              }
            }}
          >
            <Dots />
          </TouchableOpacity>

        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.bioText} numberOfLines={2}>
          {userData ? userData.bio : 'Loading...'}
          </Text>
        </View>

        <View style={styles.cardsContainer}>
  {friendsData &&friendsData.slice(0, 3).map((friend, index) => (
    <TouchableOpacity key={index} onPress={() => {navigation.navigate("FriendProfileScreen", {username: friend.username , myUserId: userData._id, isFriendOrRequestExist: true, friendUserId: friend._id,otherProfilePic:friend.profilePic})}}>
    <ImageBackground
      key={index}
      style={[styles.card, { marginRight: 8,alignContent:"center",justifyContent:"center",alignItems:"center" }]} 
      imageStyle={{ borderRadius: 12 }}
      source={getPlayerBG(friend.level.number)}
    >
      <Image
        style={styles.cardImage}
        source={friend.profilePic?{uri:friend.profilePic}:require("../../../assets/userProfilePic.png")}></Image>
      <Text style={styles.cardText}>{friend.displayName}</Text>
    </ImageBackground>
    </TouchableOpacity>
  ))}
</View>


      </Wrapper>
    </View>
  );
};

export default ProfileScreen;
