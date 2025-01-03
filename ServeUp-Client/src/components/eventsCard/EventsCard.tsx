import React, { useState } from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import styles from "./Styles";
import ChatBall from "../../../assets/chatBall.svg";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../helpers/config";
import { fetchChatID } from "../../../helpers/getters";
const EventsCard = ({ navigation, details }: any) => {
  const { name, exp, bgImageSource, profileImageSrc, location, date, username, friendUserId, myUserId } = details;
  const [isVisible, setIsVisible] = useState(true);
  const handlePress = () => {
    // Hide the card
    setIsVisible(false);
  };

  if (!isVisible) {
    // Return null if the card is not visible
    return null;
  }
  
  const handleChatPress = async() =>{
    const chatID = await fetchChatID(username);
    const formatedDate = date.replace("|", "at");
    navigation.navigate("EventChatScreen", {
      ChatID: chatID,
      name: name,
      image: profileImageSrc,
      preMessage: `Hey ${name}, I want to play with you on ${formatedDate} in ${location}`,
    });

  } 

  const handleTransfer = () => {
    // Handle transfer to the otherUserProfile screen
    navigation.navigate("OtherUserProfile", {
      username: username,
      myUserId: myUserId,
      friendUserId: friendUserId,
    });
  };

  return (
    <ImageBackground
      imageStyle={{ borderRadius: 16 }}
      style={styles.bg}
      source={bgImageSource}
    >
      <View style={styles.transparentView}>
        <TouchableOpacity style={styles.clickableView} onPress={handleTransfer}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={styles.avatarContainer}>
              <Image style={styles.avatar} source={profileImageSrc?{uri:profileImageSrc}:require("../../../assets/userProfilePic.png") }/>
            </View>
            {/* Close button and Chat ball button */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={handleChatPress}>
                <ChatBall />
              </TouchableOpacity>
            <TouchableOpacity style={[styles.playBtn, { marginLeft: 12 }]} onPress={handlePress}>
                <Text style={styles.playBtnText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              opacity: 1,
              // backgroundColor: "red",
            }}
          >
            <Text style={styles.cardTitle}>
              {" "}
              {name.length > 20 ? name.substring(0, 20) + "..." : name}
            </Text>
            <Text style={styles.expLevel}>{exp}</Text>
          </View>

          <Text style={styles.cardDesp}>{location}</Text>
          <Text style={styles.cardDesp}>{date}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default EventsCard;
