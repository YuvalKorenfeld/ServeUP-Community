import React from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../helpers/config";

const MyEventsCard = ({ details }: any) => {
  const { name, desp, exp, bgImageSource, profileImageSrc, location, date, id } = details;


  const deletePost = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
  
      const response = await fetch(`${config.serverAddress}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        // Handle error here, for example:
        console.error('Error deleting post:', response.status, response.statusText);
      } 
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };
  

  return (
    <ImageBackground
      imageStyle={{ borderRadius: 16 }}
      style={styles.bg}
      source={bgImageSource}
    >
      <View style={styles.transparentView}>
        <TouchableOpacity style={styles.clickableView} disabled={true}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={profileImageSrc?{uri:profileImageSrc}:require('../../../assets/userProfilePic.png')} />
          </View>
          {/* Close button and Chat ball button */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={[styles.playBtn, { marginLeft: 12 }]} onPress={deletePost}>
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

export default MyEventsCard;
