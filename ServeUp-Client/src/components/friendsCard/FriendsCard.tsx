import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../helpers/config";
import { fetchChatID } from "../../../helpers/getters";
const FriendsCard = ({ details, index, arrayLength }: any) => {
  const { name, exp, id,friendUsername,imageSource ,myUserId} = details;
  const navigation = useNavigation<any>();
  
  const handleLetsPlayPress = async () => {
    const chatId = await fetchChatID(friendUsername);
    navigation.navigate("NestedNewChatScreen", {
      ChatID: chatId,
      name: name,
      image: imageSource,
      preMessage: `Hey ${name}, Lets Play !`,
    });
  };
  return (
    <TouchableOpacity key={index} onPress={() => {navigation.navigate("FriendProfileScreen", {username: friendUsername , myUserId:myUserId, isFriendOrRequestExist: true, friendUserId: id,otherProfilePic:imageSource})}}>
    <View
      style={[
        styles.mainView,
        { borderBottomWidth: index == arrayLength - 1 ? 0 : 1 },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.cardImage}
          source={imageSource?{uri:imageSource}:require("../../../assets/userProfilePic.png")}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText}>
            {name.length > 20 ? name.substring(0, 20) + "..." : name}
          </Text>
          <Text style={styles.cardExpText}>{exp}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.playBtn}
        onPress={handleLetsPlayPress}
      >
        <Text style={styles.playBtnText}>Let’s Play</Text>
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );
};

export default FriendsCard;
