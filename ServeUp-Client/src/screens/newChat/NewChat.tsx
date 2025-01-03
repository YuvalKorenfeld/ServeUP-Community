import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackIcon from "../../../assets/BackIcon.svg";
import ChatBall from "../../../assets/chatBall.svg";
import NewChat from "../../../assets/newChat.svg";
import SendIcon from "../../components/sendButton/sendButton";
import styles from "./Styles";
import ChatMessage from "../../components/chatMessage/chatMessage";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messageSocket from "../../../helpers/messageSocket";
const NewChatScreen = ({ route,navigation }: any) => {
  const {ChatID,name,preMessage,image,uname} = route.params;
  let data = {
    name: name
  };
  let socket = null;
  const fetchData = async () => {
    try {
      const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
      const username = await AsyncStorage.getItem("username");
      setUsername(username);
      try{
        socket = messageSocket.getSocketInstance();
        }catch{
          socket = messageSocket.initializeSocket(token);
        }
        socket.on("message", (message) => {
          const messageObject = JSON.parse(message);
          if (messageObject.chatId === ChatID) {
            setMessages((prevMessages) => [...prevMessages, messageObject.message]);
          }
        });
      const response = await fetch(`${config.serverAddress}/api/Chats/${ChatID}/Messages`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }); 
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error while fetching user data:", error.message);
    }
  };
    useEffect(() => {
        fetchData();
        if(preMessage){
          setInputValue(preMessage);
          setSendDisabled(false);
        }
    }, []);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");

  const inputRef = useRef<any>();
  const [inputValue, setInputValue] = useState('');
  const [sendDisabled, setSendDisabled] = useState(true); // Disable the button when input is empty or only contains whitespace
  const handleInputChange = (text) => {
    setInputValue(text);
    setSendDisabled(text.trim().length === 0);
  };


  const handleSendPress = async() => {
    const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
    // Handle the send action here, using the inputValue
    const response = await fetch(`${config.serverAddress}/api/Chats/${ChatID}/Messages`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: inputValue,
      }),
    }); 
    if (response.ok) {
      const data = await response.json();
      messages.push(data);
      setMessages(messages);
    }
    // Optionally, you can clear the input after sending
    setInputValue('');
    setSendDisabled(true);
  };
  const scrollViewRef = useRef<any>();

  return (
    <View style={[styles.container]}>
      <View style={styles.headerView}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <BackIcon />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 12,
            }}
          >
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={image?{uri:image}:require("../../../assets/userProfilePic.png")}
              />
            </View>
            <Text style={styles.name}>
              {data.name.length > 18
                ? data.name.substring(0, 18) + "..."
                : data.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{navigation.navigate("GameLobbyScreen",{name:name,image:image,uname:uname})}}>
          <ChatBall />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        <View style={{ marginTop: 16 }}>
          {
          messages.map((item, index) => (
            <ChatMessage
              key={index}
              isSelf={item.sender===username}
              message={item.content}
          />
              ))}
        </View>
      </ScrollView>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.inputField}>
          <TextInput
            multiline
            style={styles.input}
            placeholder="type here"
            placeholderTextColor="#8F8F93"
            ref={inputRef}
            onLayout={() => inputRef.current.focus()}
            value={inputValue}
            onChangeText={handleInputChange}
          />
        </View>
        <TouchableOpacity style={{ marginLeft: 12}}
        onPress={handleSendPress}
        disabled={sendDisabled}
        
        >
          <SendIcon enabled={sendDisabled}/>
        </TouchableOpacity>
        
      </View>
      
    </View>
        
  );
};

export default NewChatScreen;
