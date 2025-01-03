import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { fetchChatID } from "../../../helpers/getters";
const LeagueCard = ({ details, index, arrayLength }: any) => {
  const { name, exp,percent, id,friendUsername,imageSource ,myUserId, myUserName} = details;

  const navigation = useNavigation<any>();
  const title =
    index === 0 ? "Golden Crown" :
    index === 1 ? "Silver Shield" :
    index === 2 ? "Bronze Blade" :
    `${percent}%`; 

  const textStyle =
    index === 0 ? styles.goldText :
    index === 1 ? styles.silverText :
    index === 2 ? styles.bronzeText :
    styles.defaultText;

  const buttonStyle =
  index === 0 ? styles.goldButton :
  index === 1 ? styles.silverButton :
  index === 2 ? styles.bronzeButton :
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
          <Text style={[styles.cardExpText, textStyle]}>{title}</Text>
        </View>
      </View>
     
      { friendUsername!==myUserName &&
      <TouchableOpacity
         style={[styles.playBtn, buttonStyle]}
        onPress={handleLetsPlayPress}
      >
        <Text style={styles.playBtnText}>Let’s Play</Text>
      </TouchableOpacity>
      }
    </View>
    </TouchableOpacity>
  );
};

export default LeagueCard;
