import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162529",
    paddingLeft: 24,
    paddingRight: 24,
  },
  rowContainer: {
    flexDirection: 'column', // Arrange children in columns
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Add space between items
    marginBottom: 20, // Add margin at the bottom for separation
  },  
  bodyContainer: {
    flex: 1,
    marginTop: 43,
  },
  plusContainer: {
    alignItems: "flex-end",
    marginTop: 16,
  },
  bg: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    // padding: "40%",
    maxHeight: "60%",
    width: "100%",
    // backgroundColor: "red",
  },
  avatarContainer: {},
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
  },
  inputField: {
    height: 64,
    // backgroundColor: "red",
    borderRadius: 16,
    borderColor: "#636363",
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: 19,
    marginTop: 24,
  },
  inputFieldText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#EEE",
    // marginLeft: 12,
  },
  doneBtnContainer: {
    alignItems: "flex-end",
  },
  doneBtn: {
    backgroundColor: "#01669E",
    borderRadius: 5,
    width: 60,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  done: {
    fontFamily: "bold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  title: {
    fontFamily: "medium",
    fontSize: 32,
    color: "#EEE",
    marginTop: 16,
  },
  input: {
    color: "#8F8F93",
    fontSize: 24,
    fontFamily: "medium",
    marginLeft: 25,
  },
  date: {
    height: 40, // Adjust the height as needed
    width: "45%",
    borderRadius: 16,
    borderColor: "#636363",
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: 19,
    paddingHorizontal: 10, // Adjust the padding as needed
    marginRight: 10,
  },
  
  time: {
    height: 40, // Adjust the height as needed
    width: "45%",
    borderRadius: 16,
    borderColor: "#636363",
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 12, // Adjust the padding as needed
    marginLeft: 10,
  },
  
  transparentView: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.78,
    borderRadius: 10,
    // alignItems: "center",
    paddingHorizontal: 12,
  },
  clickableView: {
    flex: 1,
    // alignItems: "center",
    marginTop: 12,
  },
  cardTitle: {
    fontFamily: "medium",
    fontSize: 18,
    color: "#FFF",
    lineHeight: 18,
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
  desp: {
    fontFamily: "medium",
    fontSize: 24,
    color: "#FFF",
    textAlign: "center",
    marginTop: 12,
  },
  mainView: {
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
    zIndex: 2000,
    backgroundColor: "#162529",
    marginBottom: 5,
    height: 40,
  },
  dropdownContainer2: {
    borderWidth: 1,
    borderColor: "#636363",
    borderRadius: 16,
    marginTop: 0,
    zIndex: 2000,
    backgroundColor: "#162529",
    marginBottom: 5,
    height: 60,
  },
  dropdownText: {
    fontFamily: "medium",
    fontSize: 24,
    color: "white",
    marginLeft: 12,
  },
  dropdownDataContainer: {
    borderWidth: 1,
    borderColor: "#636363",
    borderRadius: 4,
    backgroundColor: "#162529",
    color: "#EEE",
    height: 180, // Adjust the height as needed
  },
  continueBtn: {
    height: 55,
    backgroundColor: "#D5FF45",
    borderRadius: 16,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    zIndex: -1,
    // margin
  },
  continueBtnText: {
    fontFamily: "semiBold",
    color: "#000",
    fontSize: 18,
  },
});
export default styles;
