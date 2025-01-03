import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bg: {
    height: 164,
    // width: "97%",
    borderRadius: 16,
    marginBottom: 17,
    marginTop: 16,
  },
  transparentView: {
    flex: 1,
    // backgroundColor: "black",
    // opacity: 0.78,
    borderRadius: 10,
    // alignItems: "center",
    paddingHorizontal: 12,
    color: "white",
  },
  clickableView: {
    flex: 1,
    // alignItems: "center",
    marginTop: 12,
    opacity: 1,
  },
  cardTitle: {
    fontFamily: "bold",
    fontSize: 18,
    color: "#FFF",
    lineHeight: 18,
    opacity: 1,
  },
  cardDesp: {
    width: "70%",
    fontFamily: "medium",
    fontSize: 18,
    color: "#FFF",
    // textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  avatarContainer: {
    opacity: 1,
  },
  avatar: {
    height: 45,
    width: 45,
    borderRadius: 117,
  },
  expLevel: {
    fontFamily: "medium",
    fontSize: 18,
    color: "#D5FF45",
    lineHeight: 18,
    opacity: 100,
  },
});
export default styles;
