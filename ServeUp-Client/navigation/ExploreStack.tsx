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
import ExploreScreen from "../src/screens/explore/Explore";
import EventsStackScreens from "./EventsStack";
import ProfileDetailScreen from "../src/screens/profileDetail/ProfileDetail";
import NewChatScreen from "../src/screens/newChat/NewChat";
const ExploreStack = createNativeStackNavigator();

const ExploreStackScreens: FC<{}> = () => {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen component={ExploreScreen} name="ExploreScreen" />
      <ExploreStack.Screen component={ProfileDetailScreen} name="ProfileDetailScreen" />
      <ExploreStack.Screen component={NewChatScreen} name="MatchChatScreen" />

      <ExploreStack.Screen
        component={EventsStackScreens}
        name="EventsScreenNested"
      />
    </ExploreStack.Navigator>
  );
};
export default ExploreStackScreens;
