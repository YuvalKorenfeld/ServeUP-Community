import React from "react";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Cross from "../../../assets/cross.svg";
import Search from "../../../assets/search.svg";
import Header from "../../components/header/Header";
import styles from "./Styles";
import FriendCardContent from "../../components/FriendCardContent/FriendCardContent";
import { useEffect } from "react";
import config from "../../../helpers/config";
import levelOptions from "../../../helpers/levelOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchScreen = ({ navigation }: any) => {
  const [friendsData, setFriendsData] = useState([]);
  const[isPill1, setIsPill1] = useState(true); 
  const [isPill2, setIsPill2] =  useState(true);
  const [isPill3, setIsPill3] =  useState(true);
  const [isPill4, setIsPill4] =  useState(true);
 

  const toggleStyle1 = () => {
    setIsPill1(!isPill1);
  };
  const toggleStyle2 = () => {
    setIsPill2(!isPill2);
  };
  const toggleStyle3 = () => {
    setIsPill3(!isPill3);
  };
  const toggleStyle4 = () => {
    setIsPill4(!isPill4);
  };

  const [myUserId, setMyUserId] = useState("");
  const [myAge, setMyAge] = useState(0);
  const [myLevel, setMyLevel] = useState("");
  const [myArea, setMyArea] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [imageSource, setImageSource] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
        const username =await AsyncStorage.getItem("username");  // Replace with your actual username
        const userProfilePicSrc =await AsyncStorage.getItem("userProfilePicSrc");  // Replace with your actual username
        setImageSource(userProfilePicSrc);
        const response = await fetch(
          `${config.serverAddress}/api/Users/${username}/all`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          //create another fetch to get the user id
          const myResponse = await fetch(
            `${config.serverAddress}/api/Users/${username}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const myData = await myResponse.json();
          setMyUserId(myData._id);
          setMyAge(myData.age);
          setMyLevel(levelOptions[myData.level.number])
          setMyArea(myData.location.adminCode)
          const data = await response.json();
          setFriendsData(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error while fetching user data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <View style={[styles.container]}>
      <Header />
      <View style={styles.headerRow}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={imageSource?{uri:imageSource}:require("../../../assets/userProfilePic.png")}
        />
      </View>

      <TouchableOpacity
        style={styles.playBtn}
        onPress={() => {
          // Handle Friends Requests button press
          navigation.navigate('FriendsRequestsScreen');
        }}>
        <Text style={styles.playBtnText}>Friends Requests</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.inputField}>
        <View style={styles.searchBarContainer}>
          <Search />
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#8F8F93"
            onChangeText={(text) => setSearchInput(text)}
          />
        </View>
      </View>
      <View style={styles.pillsContainer}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <TouchableOpacity
            style={isPill1 ? styles.pill2 : styles.pill}
            onPress={toggleStyle1}
            >
            <Text style={styles.pillText}>Nearby</Text>
            {isPill1 ? null : <Cross />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={isPill2 ? styles.pill2 : styles.pill}
            onPress={toggleStyle2}
            >
            <Text style={styles.pillText}>{myLevel}</Text>
            {isPill2 ? null : <Cross />}
            </TouchableOpacity>
          <TouchableOpacity
            style={isPill3 ? styles.pill2 : styles.pill}
            onPress={toggleStyle3}
            >
            <Text style={styles.pillText}>My Age</Text>
            {isPill3 ? null : <Cross />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.cardsWrapper}>
        {friendsData
            .filter((friend) => {
              // Filter based on search bar input
              return friend.displayName.toLowerCase().includes(searchInput.toLowerCase());
            })
            .filter((friend) => {
              // Filter based on level if the "My Level" pill is selected
              return !isPill2 ? levelOptions[friend.level.number] === myLevel : true;
            })
            .filter((friend) => {
              // Filter based on age if the "My Age" pill is selected
              return !isPill3 ? friend.age === myAge : true;
            })
            .filter((friend) => {
              // Filter based on age if the "My Location" pill is selected
              return !isPill1 ? friend.location.adminCode === myArea : true;
            })
            .map((friend) => (
              <FriendCardContent
                key={friend._id}
                name={friend.displayName}
                friendUserName={friend.username}
                level={levelOptions[friend.level.number]}
                imageSource={friend.profilePic}
                isRequestExist={friend.requestExist}
                myUserId={myUserId}
                friendUserId={friend._id}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
