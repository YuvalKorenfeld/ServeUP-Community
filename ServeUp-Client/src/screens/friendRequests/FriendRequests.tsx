import React from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import FriendsRequestsCard from "../../components/FriendsRequestsCard/FriendsRequestsCard";
import Header from "../../components/header/Header";
import styles from "./Styles";
const { width, height } = Dimensions.get("window");
import { useEffect, useState } from "react";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CircleLength = 500;
const Radius = CircleLength / (2 * Math.PI);

const FriendsRequestsScreen = ({ navigation }: any) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
        const username =await AsyncStorage.getItem("username");  // Replace with your actual username
        const userProfilePicSrc =await AsyncStorage.getItem("userProfilePicSrc");  // Replace with your actual username
        setImageUrl(userProfilePicSrc);


        const response = await fetch(`${config.serverAddress}/api/friendRequests/${username}/myFriendRequests`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFriendRequests(data);
        } else {
          console.error("Failed to fetch friend requests");
        }
      } catch (error) {
        console.error("Error while fetching friend requests:", error);
      }
    };

    fetchData();
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
      <Text style={styles.title}>My Friends Requests</Text>
      {friendRequests.map((item, index) => (
          <FriendsRequestsCard
            key={index}
            arrayLength={friendRequests.length}
            index={index}
            details={{
              name: item.fromUser.displayName,
              exp: item.exp,
              myId: item.toUser,
              friendId: item.fromUser.id,
              friendImage: item.fromUser.profilePic,
            }}
          />
        ))}
    </ScrollView>
    </View>
  );
};

export default FriendsRequestsScreen;
