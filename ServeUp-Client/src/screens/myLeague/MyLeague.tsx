import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import FriendsCard from "../../components/friendsCard/FriendsCard";
import Header from "../../components/header/Header";
import styles from "./Styles";
import config from "../../../helpers/config";
const { width, height } = Dimensions.get("window");
import levelOptions from "../../../helpers/levelOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LeagueCard from "../../components/leagueCard/LeaugeCard";
import RankCard from "../../components/rankCard/RankCard";
import DescriptionCard from "../../components/descriptionCard/DescriptionCard";
const CircleLength = 500;
const Radius = CircleLength / (2 * Math.PI);

const MyLeagueScreen = ({ navigation }: any) => {
  const [friendsData, setFriendsData] = useState(null);
  const [favoritesData, setFavoritesData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [myUserId, setMyUserId] = useState("");
  const [myLevelName, setMyLevelName] = useState(""); 
  const [myUserName, setMyUserName] = useState("");
  const [myRank, setMyRank] = useState(0);
  const [competitorsNumber, setCompetitorsNumber] = useState(0);
  const [myPercentage, setMyPercentage] = useState(0);
  const [myDisplayName, setMyDisplayName] = useState("");


  useEffect(() => {
    const fetchDataFriends = async () => {
      try {
        const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
        const username =await AsyncStorage.getItem("username");  // Replace with your actual username
        const userProfilePicSrc =await AsyncStorage.getItem("userProfilePicSrc");  // Replace with your actual username
        const myUserId =await AsyncStorage.getItem("userId");  // Replace with your actual username
        setMyUserId(myUserId);
        setImageUrl(userProfilePicSrc);
        setMyUserName(username);

        const response = await fetch(`${config.serverAddress}/api/podium`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFriendsData(data.podiumList || []); // Ensure this is an array, even if empty
          setFavoritesData((data.podiumList || []).slice(0, 3)); // Ensure this is an array, even if empty
          // Get the user's ranking from field "myRank"
          setMyRank(data.myRank);
          // Get the podiumList length
          setCompetitorsNumber(data.competitorsNumber);

          //get me percentage from the podiumList
          const myPercentage = data.podiumList.find((user: any) => user.username === username).level.percentage;
          setMyPercentage(myPercentage);

          //get my display name
          const myDisplayName = data.podiumList.find((user: any) => user.username === username).displayName;
          setMyDisplayName(myDisplayName);

          
          // Get the user's level name
          const myLevel = data.podiumList.find((user: any) => user.username === username).level.number;
          setMyLevelName(levelOptions[myLevel]);
        } else {
          console.error("Failed to fetch user data");
          console.error(await response.json());
        }
      } catch (error) {
        console.error("Error while fetching user data:", error);
      }
    };

    fetchDataFriends();
  }, []); 
  // Filter out the top 3 friends from friendsData
  const filteredFriendsData = friendsData?.filter(
    (item: any) => !favoritesData?.some((fav: any) => fav.username === item.username)
  );
  return (
    <View style={[styles.container]}>
      <Header />
      <DescriptionCard
        details={{
          name: myDisplayName,
          exp: myLevelName,
          percent: myPercentage,
          imageSource: imageUrl,
          myUserId: myUserId,
          myUserName: myUserName,
          myRank: myRank,
          competitorsNumber: competitorsNumber
        }}
        index={0}
        arrayLength={1}
      />

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      {favoritesData?.length > 0 && (
        <Text style={styles.title}>The {myLevelName} Podium</Text>
      )}
        {/* Render Leauge Card for top 3 */}
        {favoritesData?.slice(0, 3).map((item, index) => (
        <LeagueCard
          key={index}
          arrayLength={Math.min(3, favoritesData.length)}  // Ensure arrayLength is at most 3
          index={index}
          details={{
            name: item.displayName,
            friendUsername: item.username,
            exp: levelOptions[item.level.number],
            myUserName: myUserName,
            myUserId: myUserId,
            percent: item.level.percentage,
            imageSource: item.profilePic,
          }}
        />
      ))}
      
        <Text style={styles.title}>{myLevelName} League ranking</Text>
        {/* Render FriendsCard for all friends using userData */}
        {filteredFriendsData?.map((item, index) => (
          <RankCard
            key={index}
            arrayLength={filteredFriendsData.length}
            index={index}
            details={{
              name: item.displayName,
              friendUsername: item.username,
              exp: levelOptions[item.level.number],
              percent: item.level.percentage,
              imageSource: item.profilePic,
              myUserId: myUserId,
              myUserName: myUserName
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default MyLeagueScreen;
