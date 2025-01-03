import React, { useEffect } from "react";
import { ImageBackground, Text, View } from "react-native";
import Ball from "../../../assets/ball.svg";
import styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryCard = ({ navigation, details }: any) => {
    const { name, date, id, winner, myUsername, profileImageSrc, leftProfilePicSrc } = details;

    const getImageSource = async () => {
      if (leftProfilePicSrc) {
        return leftProfilePicSrc;
      } else {
        // Get the URL from AsyncStorage
        const url = await AsyncStorage.getItem('userProfilePicSrc');
        return url || '../../../assets/userProfilePic.png';
      }
    };
    const [url, setUrl] = React.useState(null);
    useEffect(() => {
      getImageSource().then((url) => setUrl(url));
    }, []);
    return (
      <View style={styles.mainView}>
        <ImageBackground
          imageStyle={styles.ImageBackground}
          source={{ uri: url }}
        >
          {winner.username == myUsername && <Ball style={[styles.ball,{marginLeft:25} ]} />}
        </ImageBackground>
        <View style={{ marginLeft:45, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.name}>
            {name.length > 25 ? name.substring(0, 25) + "..." : name}
          </Text>
          <Text style={styles.date}>{date} </Text>
          <Text numberOfLines={1} style={styles.detailsText}>
            {id}
          </Text>
        </View>
        <ImageBackground
          style={styles.ImageBackground}
          imageStyle={styles.ImageBackground}
          source={profileImageSrc?{ uri: profileImageSrc} : require('../../../assets/userProfilePic.png') }
        >
          {winner.username != myUsername && <Ball style={[styles.ball,{marginLeft:-35} ]} />}
        </ImageBackground>
      </View>
    );
  };

  export default HistoryCard;

