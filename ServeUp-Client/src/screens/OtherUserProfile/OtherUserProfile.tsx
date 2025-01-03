import React, { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import Header from "../../components/header/Header";
import HistoryCard from "../../components/histortCard/HistoryCard";
import styles from "./Styles";
import { useState } from "react";
import config from "../../../helpers/config";
import levelOptions from "../../../helpers/levelOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal"
import { fetchChatID } from "../../../helpers/getters";
const OtherUserProfile = ({ navigation, route }: any) => {
  const { username, myUserId, isFriendOrRequestExist, friendUserId,otherProfilePic} = route.params;

  const [otherUser, setOtherUser] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [usersData, setUsersData] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  
  const handleMoveToChat = async () => {
    const chatID = await fetchChatID(otherUser.username);
      navigation.navigate("ProfileChatScreen", {
        ChatID: chatID,
        image: otherProfilePic,
        name: otherUser.displayName
      });
    
  }

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem("userToken");
          const myUsername = await AsyncStorage.getItem("username");
  
          const response = await fetch(
            `${config.serverAddress}/api/Users/${myUsername}/all`,
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
            const data = await response.json();
            setUsersData(data);
  
            // Find the friend username from the users data
            const friend = data.find((user: any) => user.username === username);
  
            if (friend && friend.requestExist === "true") {
              setFriendRequestSent(true);
            }
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error while fetching user data:", error);
        }
      };
  
      fetchData();
    }, [])
  );

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken"); // Replace with your actual access token
        const otherUserDetails = `${config.serverAddress}/api/Users/other/${username}/`;

        const response = await fetch(otherUserDetails, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setOtherUser(data);

        
          const gameHistoryUrl = `${config.serverAddress}/api/games/${username}`;
          const historyResponse = await fetch(gameHistoryUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!historyResponse.ok) {
            throw new Error(`HTTP error! Status: ${historyResponse.status}`);
          }

          const historyResult = await historyResponse.json();
          setGameHistory(historyResult.data);
        }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMatchData();
  }, []);

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

  const formatDateTime = (mongooseDate) => {
    const dateObject = new Date(mongooseDate);

    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObject.getFullYear();

    const hours = dateObject.getHours().toString().padStart(2, "0");
    const minutes = dateObject.getMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} | ${hours}:${minutes}`;
  };

  const handleAddFriend = async () => {
    try {
      const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
      const requestData = {
        fromUser: myUserId,  
        toUser: friendUserId,      
        createdAt: new Date().toISOString(), 
      };
      const response = await fetch(`${config.serverAddress}/api/friendRequests`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setFriendRequestSent(true);

      } else {
        console.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error while sending friend request:", error);
    }
  };

  return (
    <View style={[styles.container]}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {/* Check for perfectMatch at the beginning */}
        {otherUser ? (
          <>
            {/* Existing content when perfectMatch is not null */}
            <View style={styles.avatarContainer}>
            <TouchableOpacity
            onPress={() => {
              setSelectedImage(otherProfilePic);
              setModalVisible(true);
            }}
          >
            <Image
              style={styles.avatar}
              source={
                otherProfilePic
                  ? { uri: otherProfilePic }
                  : require("../../../assets/userProfilePic.png")
              }
            />
          </TouchableOpacity>
               {/* Modal for displaying enlarged image */}
               <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                animationInTiming={500}
                animationOutTiming={500}
                swipeDirection="down" // Optional: Enable swipe down to close
                onSwipeComplete={() => setModalVisible(false)} // Optional: Close on swipe
              >
                <TouchableOpacity
                  style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                  onPress={() => setModalVisible(false)}
                >
                  <Image
                    style={{ width: 280, height: 280, borderRadius: 100 }}
                    source={
                      selectedImage
                        ? { uri: selectedImage }
                        : require("../../../assets/userProfilePic.png")
                    }
                  />
                </TouchableOpacity>
              </Modal>


  <View style={styles.vertical}>
  <TouchableOpacity 
    style={friendRequestSent ? styles.greyBtn : styles.playBtn}
    disabled={friendRequestSent}
    onPress={ handleAddFriend }
  >
    <Text style={styles.playBtnText}>Add Friend </Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.playBtn} 
    onPress={handleMoveToChat}
  >
    <Text style={styles.playBtnText}>Start Chat</Text>
  </TouchableOpacity>
  </View>
</View>

            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>
                {otherUser?.displayName || "Unknown"} |{" "}
              </Text>
              <Text style={styles.expLevel}>
                {levelOptions[otherUser?.level?.number] || "Unknown"}
              </Text>
            </View>

            <Text style={styles.nameDesp}>
              {otherUser.location?.name || "Unknown"}
            </Text>

            <Text style={styles.bio}>
              {otherUser.bio || "Unknown"}
            </Text>

            {otherUser ? (
              <Text style={styles.bio}>
                Game History for {otherUser?.displayName}:
              </Text>
            ) : null}

            {gameHistory && gameHistory.length > 0 ? (
              <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                {gameHistory.map((item, index) => (
                  <View style={{ marginBottom: 16 }} key={index}>
                    <HistoryCard
                      details={{
                        name:
                          item.player1.username === otherUser.username
                            ? item.player2.displayName
                            : item.player1.displayName,
                        date: formatDateTime(item.date),
                        id: generateSetsString(item.sets),
                        winner: item.winner,
                        myUsername: otherUser.username,
                        leftProfilePicSrc: otherProfilePic,
                        profileImageSrc: item.player1.username === otherUser.username ? item.player2.profilePic : item.player1.profilePic,
                      }}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noDataText}>No game history available.</Text>
            )}
          </>
        ) : (
          // Render the error message when perfectMatch is null
          <View style={styles.centeredContainer}>
            <Text style={styles.noDataText}>
              Loading User data...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OtherUserProfile;
