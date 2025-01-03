// FriendCardContent.tsx
import React from "react";
import { Image, Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OtherUserProfile from "../../screens/OtherUserProfile/OtherUserProfile";
import { useFocusEffect } from "@react-navigation/native";
interface FriendCardContentProps {
  name: string;
  friendUserName: string;
  level: string;
  imageSource: ImageSourcePropType;
  isRequestExist: string;
  myUserId: string;
  friendUserId: string;
}

const FriendCardContent: React.FC<FriendCardContentProps> = ({ name, friendUserName, isRequestExist, level, imageSource, myUserId, friendUserId }) => {
  const navigation = useNavigation<any>();
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem("userToken");
          const username = await AsyncStorage.getItem("username");
  
          const response = await fetch(
            `${config.serverAddress}/api/Users/${username}/all`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.ok) {
            const data = await response.json();
            setUsersData(data);
  
            // Find the friend username from the users data
            const friend = data.find((user: any) => user.username === friendUserName);
  
            if (friend && friend.requestExist === "true") {
              setFriendRequestSent(true);
            }
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error while fetching user data:", error);
        }
      };
  
      fetchData();
    }, [])
  );

  const handleAddFriend = async () => {
    try {
      const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
      const requestData = {
        fromUser: myUserId,  
        toUser: friendUserId,      
        createdAt: new Date().toISOString(), 
      };
      const response = await fetch(`${config.serverAddress}/api/friendRequests`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setFriendRequestSent(true);

      } else {
        console.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error while sending friend request:", error);
    }
  };


  return (
    <View style={styles.friendCard}>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() => {
          navigation.navigate("OtherUserProfile", { username: friendUserName , myUserId: myUserId, isFriendOrRequestExist: friendRequestSent, friendUserId: friendUserId,otherProfilePic:imageSource});
        }}
      >
        <Image
          style={styles.cardAvatar}
          source={imageSource? {uri:imageSource} : require("../../../assets/userProfilePic.png")}
        />
      </TouchableOpacity>
      <Text style={styles.cardText}>
        {name.length > 12 ? name.substring(0, 12) + "..." : name}
      </Text>
      <Text style={styles.cardExpText}>{level}</Text>
      <TouchableOpacity 
      style={friendRequestSent ? styles.greyBtn : styles.playBtn}
      disabled={friendRequestSent}
      onPress={() => {
        handleAddFriend();
      }}
      >
      <Text style={styles.playBtnText}>Add Friend </Text>
      </TouchableOpacity>

    </View>
  );
};

export default FriendCardContent;
