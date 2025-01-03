import { StyleSheet, Platform } from "react-native";

const OS = Platform.OS;

const styles = StyleSheet.create({
  header: {
    height: 70,
    // backgroundColor: "#01669E",

    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
  },
  headerText: {},
  actionsContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 33,
    width: 13,
    alignItems: "center",
  },
});

export default styles;
