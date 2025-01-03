import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import FriendsCard from "../../components/friendsCard/FriendsCard";
import Header from "../../components/header/Header";
import styles from "./Styles";
import config from "../../../helpers/config";
const { width, height } = Dimensions.get("window");
import levelOptions from "../../../helpers/levelOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CircleLength = 500;
const Radius = CircleLength / (2 * Math.PI);

const MyFriendsScreen = ({ navigation }: any) => {
  const [friendsData, setFriendsData] = useState(null);
  const [favoritesData, setFavoritesData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [myUserId, setMyUserId] = useState("");


  useEffect(() => {
    const fetchDataFriends = async () => {
      try {
        const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
        const username =await AsyncStorage.getItem("username");  // Replace with your actual username
        const userProfilePicSrc =await AsyncStorage.getItem("userProfilePicSrc");  // Replace with your actual username
        const myUserId =await AsyncStorage.getItem("userId");  // Replace with your actual username
        setMyUserId(myUserId);
        setImageUrl(userProfilePicSrc);

        const response = await fetch(`${config.serverAddress}/api/Users/friends`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFriendsData(data);
        } else {
          console.error("Failed to fetch user data");
          console.error(response.json())
        }
      } catch (error) {
        console.error("Error while fetching user data:", error);
      }
    };

    const fetchDataFavorites = async () => {
      try {
        const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
        const username =await AsyncStorage.getItem("username");  // Replace with your actual username

        const response = await fetch(`${config.serverAddress}/api/Users/${username}/favorites`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFavoritesData(data);
        } else {
          console.error("Failed to favorites user data");
          console.error(response.json())
        }
      } catch (error) {
        console.error("Error while fetching favorites data:", error);
      }
    }

    fetchDataFriends();
    fetchDataFavorites();
  }, []); 

  return (
    <View style={[styles.container]}>
      <Header />
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={imageUrl?{uri:imageUrl}:require("../../../assets/userProfilePic.png")}
        />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      {favoritesData?.length > 0 && (
        <Text style={styles.title}>Favorites</Text>
      )}
        {/* Render FriendsCard for favorites using userData */}
        {favoritesData?.slice(0, 3).map((item, index) => (
        <FriendsCard
          key={index}
          arrayLength={Math.min(3, favoritesData.length)}  // Ensure arrayLength is at most 3
          index={index}
          details={{
            name: item.displayName,
            friendUsername: item.username,
            exp: levelOptions[item.level.number],
            imageSource: item.profilePic,
          }}
        />
      ))}
        <Text style={styles.title}>Friends</Text>
        {/* Render FriendsCard for all friends using userData */}
        {friendsData?.map((item, index) => (
          <FriendsCard
            key={index}
            arrayLength={friendsData.length}
            index={index}
            details={{
              name: item.displayName,
              friendUsername: item.username,
              exp: levelOptions[item.level.number],
              imageSource: item.profilePic,
              myUserId: myUserId,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default MyFriendsScreen;
