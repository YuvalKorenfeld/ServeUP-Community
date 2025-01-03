import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BackIcon from "../../../assets/BackIcon.svg";

import styles from "./Styles";

interface HeaderProps {
  title?: string;
}
const Header = ({ title }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </View>
  );
};
export default Header;
