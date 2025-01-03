import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Plus from "../../../assets/plus.svg";
import EventsCard from "../../components/eventsCard/EventsCard";
import { useState } from "react";
import { useEffect } from "react";
import config from "../../../helpers/config";
import styles from "./Styles";
import levelOptions from "../../../helpers/levelOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyEventsCard from "../../components/myEventsCard/myEventsCard";
import { Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getPlayerBG } from "../../../helpers/getters";
const MyEventsScreen = ({ navigation }: any) => {
  const [postData, setPostData] = useState([]);
  const [imageSource, setImageSource] = useState("");

  // Function to fetch data from the server
  const fetchData = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const username = await AsyncStorage.getItem("username");
    const userProfilePicSrc = await AsyncStorage.getItem("userProfilePicSrc");
    setImageSource(userProfilePicSrc);

    try {
      const response = await fetch(`${config.serverAddress}/api/posts/${username}/myPosts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();

      // Filter out expired posts
      const currentDate = new Date();
      const filteredData = jsonData.filter(item => {
        const postDate = new Date(item.date);
        return postDate >= currentDate;
      });

      setPostData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };


  useFocusEffect(() => {
    fetchData();
  });

  const formatDateTime = (mongooseDate) => {
    const dateObject = new Date(mongooseDate);
  
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
  
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
  
    return `${day}.${month}.${year} | ${hours}:${minutes}`;
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={styles.plusContainer}
        onPress={() => {
          navigation.navigate("NewEventScreen");
        }}
      >
        <Plus />
      </TouchableOpacity>

      {postData.length > 0 ? (
  <ScrollView>
    {postData.map((item, index) => (
      <MyEventsCard
        key={index}
        details={{
          bgImageSource: getPlayerBG(item.player.level.number),
          profileImageSrc: imageSource,
          name: item.player.displayName,
          exp: " | " + levelOptions[item.player.level.number],
          location: item.location.name,
          date: formatDateTime(item.date),
          id: item.id
        }}
      />
    ))}
  </ScrollView>
) : (
  <View style={styles.centeredContainer}>
    <Text style={styles.noDataText}>You have not posted any game proposals yet</Text>
  </View>

)}
    </View>
  );
};

export default MyEventsScreen;
