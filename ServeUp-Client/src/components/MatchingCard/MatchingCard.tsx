import React from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./Styles";

const MatchingCard = ({ details }: any) => {
  const { name, desp, bgImageSource, profileImageSrc, location, date, id } = details;

  return (
    <ImageBackground
      imageStyle={{ borderRadius: 16 }}
      style={styles.bg}
      source={bgImageSource}
    >
      <View style={styles.transparentView}>
        <TouchableOpacity style={styles.clickableView}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={ {uri:profileImageSrc||require("../../../assets/userProfilePic.png")}} />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              opacity: 1,
              // backgroundColor: "red",
            }}
          >
            <Text style={styles.expLevel}>
              {" "}
              {name.length > 30 ? name.substring(0, 35) : name}
            </Text>
          </View>

          <Text style={styles.cardDesp}>{location}</Text>
          <Text style={styles.cardDesp}>{date}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default MatchingCard;
