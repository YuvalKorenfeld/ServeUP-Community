import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../src/screens/login/Login";
import SignupScreen from "../src/screens/signup/Signup";
import ProfileScreen from "../src/screens/profile/Profile";
import EditProfileScreen from "../src/screens/editProfile/EditProfile";
import GameHistoryScreen from "../src/screens/gameHistory/GameHistory";
import MyFriendsScreen from "../src/screens/myFriends/MyFriends";
import SearchScreen from "../src/screens/search/Search";
import ProfileDetailScreen from "../src/screens/profileDetail/ProfileDetail";
import FriendsRequestsScreen from "../src/screens/friendRequests/FriendRequests";
import OtherUserProfile from "../src/screens/OtherUserProfile/OtherUserProfile";
import NewChatScreen from "../src/screens/newChat/NewChat";
const SearchStack = createNativeStackNavigator();

const SearchStackScreens: FC<{}> = () => {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen component={SearchScreen} name="SearchScreen" />
      <SearchStack.Screen
        component={OtherUserProfile}
        name="OtherUserProfile"
      />
      <SearchStack.Screen
        component={NewChatScreen}
        name="ProfileChatScreen"></SearchStack.Screen>
      <SearchStack.Screen
        component={FriendsRequestsScreen}
        name="FriendsRequestsScreen"  />
    </SearchStack.Navigator>
  );
};
export default SearchStackScreens;
