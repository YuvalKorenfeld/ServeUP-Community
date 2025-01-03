import { StyleSheet } from "react-native";
import { ZeplinHeight, ZeplinWidth } from "../../../helpers/ZeplineHelper";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162529",
    paddingLeft: 24,
    paddingRight: 24,
  },
  bodyContainer: {
    flex: 1,
    marginTop: "4%",
  },
  contentContainerStyle: {
    // flex: 1,
  },
  mainView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    flex: 1,
  },
  title: {
    fontFamily: "bold",
    fontSize: 32,
    color: "#EEE",
  },
  desp: {
    fontFamily: "bold",
    fontSize: 24,
    color: "#8F8F93",
    marginTop: 6,
  },
  avatarViewContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  avatarContainer: {
    backgroundColor: "#343434",
    borderRadius: 90,
    height: 90,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    height: 64,
    // backgroundColor: "red",
    borderRadius: 16,
    borderColor: "#636363",
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: 19,
    zIndex: -1000,
  },
  inputFieldText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#EEE",
    marginLeft: 12,
  },
  input: {
    color: "#8F8F93",
    fontSize: 24,
    fontFamily: "medium",
    marginLeft: 25,
  },
  signupBtn: {
    height: 55,
    backgroundColor: "#D5FF45",
    borderRadius: 16,
    marginTop: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signupBtnText: {
    fontFamily: "semiBold",
    color: "#000",
    fontSize: 18,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#636363",
    borderRadius: 16,
    marginTop: -4,
    backgroundColor: "#162529",
    marginBottom: 16,
    height: 65,
  },
  dropdownText: {
    fontFamily: "medium",
    fontSize: 24,
    color: "grey",
    marginLeft: 12,
  },
  dropdownDataContainer: {
    borderWidth: 1,
    borderColor: "#636363",
    borderRadius: 4,
    zIndex: 1000,
    backgroundColor: "#162529",
    color: "#EEE",
  },
  bg: {
    width: 160,
    height: 160,
    // flex: 1,
    borderRadius: 16,
    marginBottom: 17,
    // paddingHorizontal: 16,
    // paddingVertical: 20,
  },
  selectedImage: {
    borderWidth: 4,
    borderColor: "#D5FF45", // Yellow color
    overflow: "hidden", // Add this line
  },
  
  
  
  transparentView: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.78,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  clickableView: {
    flex: 1,
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "displayBold",
    fontSize: 24,
    color: "#D5FF45",
    marginTop: 11,
    opacity: 100,
  },
  cardDesp: {
    fontFamily: "displayBold",
    fontSize: 12,
    color: "#FFF",
    textAlign: "center",
    marginTop: 8,
  },
});
export default styles;
