import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
const FriendsRequestsCard = ({ details, index, arrayLength }: any) => {
  const { name, exp, myId, friendId,friendImage } = details;
  const navigation = useNavigation<any>();
  const [isApproving, setIsApproving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const doApproveLogic = async () => {
    const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token

    try {
      // Define the data to be sent in the body
      const requestData = {
        fromUser: friendId,
        toUser: myId,
      };
      const response = await fetch(`${config.serverAddress}/api/friendRequests/accept`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setIsVisible(false); 
        
      } else {
        console.error("Failed to approve friend request");
      }
    } catch (error) {
      console.error("Error while approving friend request:", error);
    } 
  };

  const doRejectLogic = async () => {
    const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
    try {  
      // Define the data to be sent in the body
      const requestData = {
        fromUser: friendId,
        toUser: myId,
      };
        const response = await fetch(`${config.serverAddress}/api/friendRequests/decline`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        setIsVisible(false);
      } else {
        console.error("Failed to decline friend request");
      }
    } catch (error) {
      console.error("Error while declining friend request:", error);
    }
  };

  if (!isVisible) {
    return null; // Return null to render nothing when isVisible is false
  }


  return (
    <View
      style={[
        styles.mainView,
        { display: isApproving ? "none" : "flex" },  // Hide the component when approving
        { borderBottomWidth: index === arrayLength - 1 ? 0 : 1 },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.cardImage}
          source={friendImage? {uri: friendImage} : require("../../../assets/userProfilePic.png")}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText}>
            {name.length > 16 ? name.substring(0, 16) + "..." : name}
          </Text>
          <Text style={styles.cardExpText}>{exp}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity 
          style={[styles.playBtn, { marginRight: 8 }]}
          onPress={() => doApproveLogic()}
        >
          <Text style={styles.playBtnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => doRejectLogic()}
        >
          <Text style={styles.playBtnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendsRequestsCard;
