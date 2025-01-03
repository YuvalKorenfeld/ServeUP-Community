import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import Plus from "../../../assets/plus.svg";
import EventsCard from "../../components/eventsCard/EventsCard";
import styles from "./Styles";
import config from "../../../helpers/config";
import  levelOptions  from "../../../helpers/levelOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getPlayerBG } from "../../../helpers/getters";
const EventsScreen = ({ navigation }: any) => {
  const [postData, setPostData] = useState([]);
  const [myUserId, setMyUserId] = useState("");

  useFocusEffect(() => {
    // Function to fetch data from the server
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const username = await AsyncStorage.getItem("username");

      try {
        const response = await fetch(`${config.serverAddress}/api/posts/${username}`, {
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
        //create get request for my userid
        const response2 = await fetch(`${config.serverAddress}/api/users/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response2.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData2 = await response2.json();
        setMyUserId(jsonData2._id);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    // Call the fetch data function
    fetchData();
  }); 


  // Function to format Mongoose date to a user-friendly format
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
      <View style={styles.headerRow}>
      <TouchableOpacity
        style={styles.playBtn}
        onPress={() => {
          // Handle Friends Requests button press
          navigation.navigate('MyEventsScreen');
        }}>
        <Text style={styles.playBtnText}>My Games Proposals</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.plusContainer}
        onPress={() => {
          navigation.navigate("NewEventScreen");
        }}
      >
        <Plus />
      </TouchableOpacity>

      </View>

      {postData.length > 0 ? (
        <ScrollView>
          {postData.map((item, index) => (
            <EventsCard
              key={index}
              navigation={navigation}
              details={{
                bgImageSource: getPlayerBG(item.player.level.number),
                profileImageSrc: item.player.profilePic,
                name: item.player.displayName,
                exp: " | " + levelOptions[item.player.level.number],
                location: item.location.name,
                date: formatDateTime(item.date),
                username: item.player.username,
                friendUserId: item.player._id,
                myUserId: myUserId,
              }}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.centeredContainer}>
          <Text style={styles.noDataText}>
            They are no game proposals yet
          </Text>
        </View>
      )}

    </View>
  );
};

export default EventsScreen;
