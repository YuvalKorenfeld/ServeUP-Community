import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../src/screens/login/Login";
import SignupScreen from "../src/screens/signup/Signup";
import ProfileScreen from "../src/screens/profile/Profile";
import EditProfileScreen from "../src/screens/editProfile/EditProfile";
import GameHistoryScreen from "../src/screens/gameHistory/GameHistory";
import MyFriendsScreen from "../src/screens/myFriends/MyFriends";
import EventsScreen from "../src/screens/events/Events";
import NewEventScreen from "../src/screens/newEvent/NewEvent";
import ChatListScreen from "../src/screens/chatList/ChatList";
import NewChatListScreen from "../src/screens/newChatList/NewChatList";
import NewChatScreen from "../src/screens/newChat/NewChat";
import GameLobbyScreen from "../src/screens/gameLobby/GameLobby";
const ChatStack = createNativeStackNavigator();

const ChatStackScreens: FC<{}> = () => {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen component={ChatListScreen} name="ChatScreen" />
      <ChatStack.Screen
        component={NewChatListScreen}
        name="NewChatListScreen"
      />
      <ChatStack.Screen component={NewChatScreen} name="NewChatScreen" />
      <ChatStack.Screen component={GameLobbyScreen} name="GameLobbyScreen" />
    </ChatStack.Navigator>
  );
};
export default ChatStackScreens;
