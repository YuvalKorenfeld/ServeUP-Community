import React, { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import Header from "../../components/header/Header";
import HistoryCard from "../../components/histortCard/HistoryCard";
import styles from "./Styles";
import { useState } from "react";
import MatchingCard from "../../components/MatchingCard/MatchingCard";
import config from "../../../helpers/config";
import levelOptions from "../../../helpers/levelOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal"

import { fetchChatID, getPlayerBG } from "../../../helpers/getters";
const ProfileDetailScreen = ({ navigation, route }: any) => {
  const { username, date, location, currentDate } = route.params;
  const [perfectMatch, setPerfectMatch] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Use useFocusEffect to run code when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const disableBackButton = () => {
        navigation.setOptions({
          headerLeft: () => null, // Disable the back button
        });
      };

      disableBackButton();

      // Cleanup the effect when the screen is not focused
      return () => {
        navigation.setOptions({
          headerLeft: undefined, // Restore the original headerLeft
        });
      };
    }, [])
  );
  
  const handleMoveToChat = async() => {
    const chatID = await fetchChatID(perfectMatch.matchingUser.username);
    const formatedDate = formatDateTime(perfectMatch.maxPost.date).replace("|", "at");

    navigation.navigate("MatchChatScreen", {
      ChatID: chatID,
      name: perfectMatch.matchingUser.displayName,
      image:perfectMatch.matchingUser.profilePic,
      preMessage: `Hey ${perfectMatch.matchingUser.displayName}, It seems you are the perfect opponent for me for a tennis match on ${formatedDate} in ${perfectMatch.maxPost.location.name}. Lets Play !`,
    });

    }

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken"); 
        const username = await AsyncStorage.getItem("username"); 
        const matchUrl = `${config.serverAddress}/api/Users/${username}/match`;

        const matchResponse = await fetch(matchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: username,
            date: date,
            currentDate: currentDate,
            location: {
              name: location.name,
              adminCode: location.adminCode,
            },
          }),
        });

        if (!matchResponse.ok) {
          throw new Error(`HTTP error! Status: ${matchResponse.status}`);
        }

        const matchResult = await matchResponse.json();
        setPerfectMatch(matchResult);

        if (matchResult && matchResult.matchingUser) {
          const gameHistoryUrl = `${config.serverAddress}/api/games/${matchResult.matchingUser.username}`;
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMatchData();
  }, [username, date, location]);

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

  return (
    <View style={[styles.container]}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {/* Check for perfectMatch at the beginning */}
        {perfectMatch && perfectMatch.maxPost ? (
          <>
            {/* Existing content when perfectMatch is not null */}
            <View style={styles.avatarContainer}>
            <TouchableOpacity
            onPress={() => {
              setSelectedImage(perfectMatch.matchingUser.profilePic);
              setModalVisible(true);
            }}
          >
              <Image
                style={styles.avatar}
                source={ (perfectMatch&&perfectMatch.matchingUser)? 
                  {uri: perfectMatch.matchingUser.profilePic}
                  :
                  require("../../../assets/userProfilePic.png")
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
              <TouchableOpacity style={styles.playBtn} onPress={handleMoveToChat}>
                <Text style={styles.playBtnText}>Lets Play</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>
                {perfectMatch?.matchingUser?.displayName || "Unknown"} |{" "}
              </Text>
              <Text style={styles.expLevel}>
                {levelOptions[perfectMatch?.matchingUser?.level?.number] || "Unknown"}
              </Text>
            </View>

            <Text style={styles.nameDesp}>
              {perfectMatch?.matchingUser?.location?.name || "Unknown"}
            </Text>

            <Text style={styles.bio}>
              {perfectMatch?.matchingUser?.bio || "Unknown"}
            </Text>

            <Text style={styles.bio}>
              The Algorithm has found you a perfect match:
            </Text>

            <View style={{ marginTop: -25, marginBottom: 8 }}>
              <MatchingCard
                details={{
                  date: formatDateTime(perfectMatch.maxPost.date),
                  location: perfectMatch.maxPost.location.name,
                  name: perfectMatch.maxPost.player.displayName + " suggests to play in:",
                  exp:
                    levelOptions[perfectMatch.maxPost.player.level.number] ||
                    "Unknown",
                  profileImageSrc: perfectMatch.matchingUser.profilePic ,
                  bgImageSource: getPlayerBG(perfectMatch.matchingUser.level.number),
                }}
              />
            </View>

            {perfectMatch.matchingUser ? (
              <Text style={styles.bio}>
                Game History for {perfectMatch.matchingUser?.displayName}:
              </Text>
            ) : null}

            {gameHistory && gameHistory.length > 0 ? (
              <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                {gameHistory.map((item, index) => (
                  <View style={{ marginBottom: 16 }} key={index}>
                    <HistoryCard
                      details={{
                        name:
                          item.player1.username === perfectMatch.matchingUser.username
                            ? item.player2.displayName
                            : item.player1.displayName,
                        date: formatDateTime(item.date),
                        id: generateSetsString(item.sets),
                        winner: item.winner,
                        myUsername: perfectMatch.matchingUser.username,
                        leftProfilePicSrc:perfectMatch.matchingUser.profilePic,
                        profileImageSrc:
                          item.player1.username === perfectMatch.matchingUser.username
                            ? item.player2.profilePic
                            : item.player1.profilePic,
                        
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
              ServeUP couldn't find you the perfect opponent.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileDetailScreen;
