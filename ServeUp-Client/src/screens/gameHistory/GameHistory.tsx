import React from "react";
import { ScrollView, TextInput, View } from "react-native";
import Search from "../../../assets/search.svg";
import Header from "../../components/header/Header";
import HistoryCard from "../../components/histortCard/HistoryCard";
import styles from "./Styles";
import { useState, useEffect } from "react";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
const GameHistoryScreen = ({ navigation }: any) => {

  const [searchInput, setSearchInput] = useState("");
  const [gameData, setGameData] = useState([]);
  const [imageSource, setImageSource] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      const token =await AsyncStorage.getItem("userToken"); 
      const username =await AsyncStorage.getItem("username");
      setUsername(username);
      const userProfilePicSrc =await AsyncStorage.getItem("userProfilePicSrc");
      setImageSource(userProfilePicSrc);
      try {
        const response = await fetch(`${config.serverAddress}/api/games/${username}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          const data = result.data.sort((a, b) =>  new Date(b.date) - new Date(a.date));
          setGameData(result.data); // Update state with the fetched data
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); 


  const formatDateTime = (mongooseDate) => {
    const dateObject = new Date(mongooseDate);
  
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
  
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
  
    return `${day}.${month}.${year} | ${hours}:${minutes}`;
  };

  const generateSetsString = (sets) => {
    if (sets.length === 1) {
      return `${sets[0].player1}-${sets[0].player2}`;
    } else if (sets.length === 2) {
      return `${sets[0].player1}-${sets[0].player2} | ${sets[1].player1}-${sets[1].player2}`;
    } else if (sets.length === 3) {
      return `${sets[0].player1}-${sets[0].player2} | ${sets[1].player1}-${sets[1].player2} | ${sets[2].player1}-${sets[2].player2}`;
    } else {
      // Handle other cases if needed
      return "Unknown Sets";
    }
  };

  
  return (
    <View style={[styles.container]}>
      <Header />
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
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      {gameData
          .filter((item) => {
            // Filter based on player name
            const player1Name = item.player1.username === username ? item.player2.displayName : item.player1.displayName;
            const player2Name = item.player1.username === username ? item.player1.displayName : item.player2.displayName;
            
            return player1Name.toLowerCase().includes(searchInput.toLowerCase()) ||
                   player2Name.toLowerCase().includes(searchInput.toLowerCase());
          })
        .map((item, index) => (
          <View style={{ marginBottom: 16 }} key={index}>
            <HistoryCard
              details={{
                name: item.player1.username === username ? item.player2.displayName : item.player1.displayName,
                date: formatDateTime(item.date),
                id: generateSetsString(item.sets),
                winner: item.winner,
                myUsername: username,
                profileImageSrc: item.player1.username === username ? item.player2.profilePic : item.player1.profilePic,
                leftProfilePicSrc: imageSource,
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default GameHistoryScreen;
