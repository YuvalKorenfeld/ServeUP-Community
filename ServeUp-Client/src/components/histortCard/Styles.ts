import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "#343434",
    flexDirection: "row",
    borderRadius: 16,
    height: 82,
    padding: 16,
    justifyContent: "space-between",
  },
  searchBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  ImageBackground: {
    height: 55,
    width: 55,
    borderRadius: 55,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  ball: {
    position: "absolute",
    left: "40%",
    bottom: -10,
  },
  name: {
    fontFamily: "medium",
    color: "#FFF",
    fontSize: 16,
    lineHeight: 18,
  },
  date: {
    fontFamily: "medium",
    color: "#FFF",
    fontSize: 16,
    lineHeight: 18,
  },
  detailsText: {
    fontFamily: "medium",
    color: "#D5FF45",
    fontSize: 16,
    lineHeight: 18,

    // textAlign: "center",
  },
});
export default styles;
