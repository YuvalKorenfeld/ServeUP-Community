import React from "react";
import { ScrollView, TextInput, View } from "react-native";
import styles from "./Styles";

import Search from "../../../assets/search.svg";
import ChatCard from "../../components/chatCard/ChatCard";
import Header from "../../components/header/Header";
import { useState } from "react";
import { useEffect } from "react";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import levelOptions from "../../../helpers/levelOptions";
const NewChatScreen = ({ navigation }: any) => {
  const [data, setData] = useState([]);
  const [friends, setFriends] = useState([]); // save friends list
  const [users, setUsers] = useState([]); // save users list
  const [search, setSearch] = useState("");

  const handleSearch = (text: string) => {
    if(text.length==0){
    setData(friends);
    return;
    }
    setSearch(text);
    const formattedQuery = text.toLowerCase();
    const filteredData = users.filter((user: any) => {
      // Check if either the username or other properties match the query
      return (
        user.username.toLowerCase().includes(formattedQuery) ||
        user.displayName.toLowerCase().includes(formattedQuery)
        // Add more conditions if there are other properties to search
      );
    });
    setData(filteredData);

  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Replace with your actual access token
      const username = await AsyncStorage.getItem("username"); // Replace with your actual username

      const response = await fetch(
        `${config.serverAddress}/api/Users/friends`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
          },
        }
      );
      if(response.ok){
        const result = await response.json();
        setFriends(result);
        setData(result);
        
      }
      const responseUsers = await fetch(
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
      if(responseUsers.ok){
        const data = await responseUsers.json();
        setUsers(data);
      }
     
    } catch (error) {
      console.error("Error fetching data:", error);
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
            placeholder="Enter Username"
            placeholderTextColor="#8F8F93"
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {data?.map((item, index) => (
          <ChatCard
            key={index}
            arrayLength={data.length}
            index={index}
            isNewChat={true}
            details={{
              uname: item.username,
              name: item.displayName,
              exp: levelOptions[item.level.number],
              image: item.profilePic,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default NewChatScreen;
