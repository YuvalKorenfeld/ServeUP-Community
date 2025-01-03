import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#162529",
    paddingLeft: 24,
    paddingRight: 24,
  },
  bodyContainer: {
    flex: 1,
    marginTop: 43,
  },
  infoContainer: {
    marginTop: 85,
    alignItems: "center",
  },
  nameText: {
    fontFamily: "displayMedium",
    fontSize: 24,
    color: "#FFF",
  },
  despContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  despText: {
    fontFamily: "displayMedium",
    fontSize: 20,
    color: "#FFF",
  },
  expLevel: {
    fontFamily: "displayMedium",
    fontSize: 20,
    color: "#D5FF45",
  },
  actionsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  historyBtn: {
    height: 40,
    backgroundColor: "#162529",
    borderColor: "#636363",
    borderWidth: 1,
    padding: 10.5,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 8,
  },
  historyBtnText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#FFF",
  },
  friendsBtn: {
    height: 40,
    backgroundColor: "#162529",
    borderColor: "#636363",
    borderWidth: 1,
    padding: 10.5,
    borderRadius: 8,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 24,
    paddingRight: 24,
  },
  friendsBtnText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#FFF",
  },
  bioContainer: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 32,
  },
  bioText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },
  cardsContainer: {
    justifyContent: "center",
    marginTop: 70,
    flexDirection: "row",
  },
  card: {
    height: 120,
    width: 120,
    justifyContent: "flex-end",
  },
  cardText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#FFF",
  },
  cardExpText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#D5FF45",
  },
  multiLineInputField: {
    height: 138,
    borderRadius: 16,
    borderColor: "#636363",
    borderWidth: 1,
    marginBottom: 19,
    zIndex: -1000,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  inputField: {
    height: 64,
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
    marginLeft: 18,
  },
  submitBtn: {
    height: 55,
    backgroundColor: "#D5FF45",
    borderRadius: 16,
    marginTop: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  submitBtnText: {
    fontFamily: "semiBold",
    color: "#000",
    fontSize: 18,
  },
  svgView: {
    height: "27%",
  },
  avatarContainer: {},
  avatar: {
    height: 45,
    width: 45,
    borderRadius: 117,
  },

  contentContainerStyle: {
    // flex: 1,
  },
  mainView: {
    backgroundColor: "#162529",
    flexDirection: "row",
    height: 82,
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: "space-between",
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#343434",
    alignItems: "center",
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
    textAlign: "center",
  },
  detailsText: {
    fontFamily: "medium",
    color: "#D5FF45",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontFamily: "medium",
    color: "#FFF",
    fontSize: 28,
    marginTop: 16,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    height: 63,
    width: 63,
    borderRadius: 117,
  },
  cardTextContainer: {
    marginLeft: 21,
  },
  playBtn: {
    height: 32,
    backgroundColor: "#D5FF45",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  playBtnText: {
    fontFamily: "medium",
    color: "#000",
    fontSize: 14,
  },
  signupBtn: {
    height: 55,
    backgroundColor: "#D5FF45",
    borderRadius: 16,
    marginTop: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  signupBtnText: {
    fontFamily: "semiBold",
    color: "#000",
    fontSize: 18,
  },
  continueBtn: {
    height: 55,
    backgroundColor: "#D5FF45",
    borderRadius: 16,
    marginTop: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  continueBtnText: {
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
    height: 50,
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
});
export default styles;
