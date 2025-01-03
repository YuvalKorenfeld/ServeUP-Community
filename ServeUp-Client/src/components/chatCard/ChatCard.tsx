import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./Styles";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../helpers/config";
import NotificationBadge from "./NotificationBadge/NotificationBadge";
import { fetchChatID } from "../../../helpers/getters";
const ChatCard = ({ details, index, arrayLength, isNewChat,setNotifications,activeChatRef }: any) => {
  const navigation = useNavigation<any>();

  const {ChatID, name, date, time, chat, exp,uname,notificationNumber,image } = details;
  const formatTimestamp = (timestamp) => {
    if(!timestamp) return "";
    const messageDate = new Date(timestamp);
    const currentDate = new Date();
  
    // Check if the message date is today
    if (
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear()
    ) {
      // If today, return the time
      const hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      return formattedTime;
    } else {
      // If not today, return DD/MM
      const year = messageDate.getFullYear().toString();
      const month = (messageDate.getMonth() + 1).toString(); // Month is zero-based, so add 1
      const day = messageDate.getDate().toString();
      
      const formattedDate = `${day.length === 1 ? '0' + day : day}/${month.length === 1 ? '0' + month : month}/${year}`;
      return formattedDate;
    }
  };
  
  const handleNewChatCardPress = async () => {
    if(isNewChat){
      const chatID= await fetchChatID(uname);
      navigation.goBack();
      navigation.navigate("NewChatScreen", {ChatID:chatID,name:name,image:image,uname:uname},{ replace: true })
    }
    else{
      navigation.navigate("ChatScreen", {ChatID:ChatID,name:name,image:image},{ replace: true })
    }
  };
  const handleChatCardPress = async () => {
    setNotifications({...notificationNumber,[ChatID]:0});
    activeChatRef.current=ChatID;
    navigation.navigate("NewChatScreen", {ChatID:ChatID,name:name,image:image,uname:uname})
  };
  return (
    <View
      style={[
        styles.mainView,
        { borderBottomWidth: index == arrayLength - 1 ? 0 : 1 },
      ]}
    >
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleChatCardPress}
      >
      <Image style={styles.cardImage} source={image?{uri:image}:require("../../../assets/userProfilePic.png")} />

        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText}>
            {name.length > 18 ? name.substring(0, 18) + "..." : name}
          </Text>

          <Text
            style={isNewChat ? styles.newChatCardExpText : styles.cardExpText}
          >
            {isNewChat
              ? exp
              : chat?
                chat.length > 30? chat.substring(0, 30) + "...": chat
              : ""}
          </Text>
        </View>
      </TouchableOpacity>
      {isNewChat == false ? (
        <View>
          <Text style={styles.time}>{formatTimestamp(time)}</Text>
          <NotificationBadge notificationNumber={notificationNumber} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.playBtn}
          onPress={handleNewChatCardPress}
        >
          <Text style={styles.playBtnText}>Start Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatCard;
