import React, { useRef } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NewChat from "../../../assets/newChat.svg";
import styles from "./Styles";
import {useEffect,useState} from "react";
import Search from "../../../assets/search.svg";
import ChatCard from "../../components/chatCard/ChatCard";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import messageSocket from "../../../helpers/messageSocket";

const ChatScreen = ({ navigation }: any) => {
  const activeChatRef = useRef("");
  let socket = null;
  const fetchData = async () => {
    try {
      const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
      const response = await fetch(`${config.serverAddress}/api/Chats/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        let data = await response.json();
        // Ensure each item has a lastMessage property before sorting
        data = data.filter((item: any) => item.lastMessage && item.lastMessage.created);
        // Sort by the created property of the lastMessage in descending order
        data.sort((a: any, b: any) => new Date(b.lastMessage.created).getTime() - new Date(a.lastMessage.created).getTime());
        chatsRef.current = data;
        setData(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error while fetching user data:", error.message);
    }
  };
    useEffect(() => {
          fetchData();
          registerToken();
    }, []);
      // Use useFocusEffect to refetch data when the screen comes into focus
    useFocusEffect(
    React.useCallback(() => {
      activeChatRef.current = "";
      fetchData();
    }, [])
  );
   
    const [data, setData] = useState([]);
    const [notifications, setNotifications] = useState({});
    const chatsRef = useRef([]);
    
    const [search, setSearch] = useState("");

    const registerToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken"); 
        //const username = await AsyncStorage.getItem("username");
        try{
        socket = messageSocket.getSocketInstance();
        }catch{
          socket = messageSocket.initializeSocket(token);
        }
        socket.on('identify', (data) => {
        socket.emit('token', "bearer "+token);
          });
        socket.on('message', (message) => {
        const messageObject = JSON.parse(message);
        if (messageObject.chatId !== activeChatRef.current) {
          setNotifications((prevNotifications) => ({
            ...prevNotifications,
            [messageObject.chatId]:(prevNotifications[messageObject.chatId] || 0) + 1,
          }));
        }
        
        const updatedChatIndex = data.findIndex((chat: any) => chat.id === messageObject.chatId)
        if (updatedChatIndex !== -1) {
          data[updatedChatIndex].lastMessage = messageObject.message;
          // Move the chat to the start of the array
          const updatedChat = data.splice(updatedChatIndex, 1)[0];
          data.unshift(updatedChat);
          chatsRef.current = data;
          setData([...data]);
        }else{
          fetchData();
        }
      
        });
      } catch (error) {
        console.error("Error while fetching user data:", error.message);
      }
    }    
const handleSearch = (text: string) => {
    if(text.length==0){
    setSearch(text);
    setData(chatsRef.current);
    return;
    }
    setSearch(text);
    const formattedQuery = text.toLowerCase();
    const filteredData = data.filter((chat: any) => {
      // Check if either the username or other properties match the query
      return (
        chat.user.username.toLowerCase().includes(formattedQuery) ||
        chat.user.displayName.toLowerCase().includes(formattedQuery)
        // Add more conditions if there are other properties to search
      );
    });
    setData(filteredData);
}

  return (
    <View style={[styles.container]}>
      <View style={styles.headerView}>
        <Text style={styles.title}>Chats</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NewChatListScreen");
          }}
        >
          <NewChat />
        </TouchableOpacity>
      </View>

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
        {data.map((item, index) => (
          <ChatCard
            isNewChat={false}
            key={index}
            arrayLength={data.length}
            index={index}
            setNotifications={setNotifications}
            activeChatRef={activeChatRef}
            details={{
              ChatID:item.id,
              uname: item.user.username,
              name: item.user.displayName,
              chat: item.lastMessage!==null?item.lastMessage.content:"",
              time: item.lastMessage!==null?item.lastMessage.created:"",
              image: item.user.profilePic,
              notificationNumber: notifications[item.id]?notifications[item.id]:0,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ChatScreen;
