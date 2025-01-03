import React, { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStackScreens from "./AuthStack";
import BottomStackScreens from "./BottomStack";
import { NavigationContainer } from "@react-navigation/native";

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={"AuthStack"}
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen component={AuthStackScreens} name="AuthStack" />
        <RootStack.Screen component={BottomStackScreens} name="BottomStack" />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
