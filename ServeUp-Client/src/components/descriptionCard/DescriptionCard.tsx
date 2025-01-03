import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { fetchChatID } from "../../../helpers/getters";
const DescriptionCard = ({ details, index, arrayLength }: any) => {
  const { name, exp,percent, id,friendUsername,imageSource ,myUserId, myUserName, myRank, competitorsNumber} = details;
  const navigation = useNavigation<any>();

  const textStyle =
    styles.defaultText;

  const buttonStyle =
  styles.defaultButton;
  
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
          <Text style={[styles.cardExpText, textStyle]}>{myRank}/{competitorsNumber} {exp} - {percent}%</Text>
        </View>
      </View>
     
    </View>
    </TouchableOpacity>
  );
};

export default DescriptionCard;
