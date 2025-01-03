import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#162529",
  },
  logoContainer: {
    flex: 1,
    backgroundColor: "#162529",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 100,
  },
  fieldsContainer: {
    flex: 1,
    backgroundColor: "#162529",
    justifyContent: "center",
    // alignItems: "center",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 12,
  },
  inputField: {
    height: 64,
    // backgroundColor: "red",
    borderRadius: 16,
    borderColor: "#636363",
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: 19,
  },
  inputFieldText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#EEE",
    marginLeft: 12,
  },
  iconAndTextContainer: {
    flexDirection: "row",
    marginLeft: 16,
  },
  iconAndTextFacebookContainer: {
    flexDirection: "row",
    marginLeft: 12,
  },
  inputFieldFbText: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#EEE",
    marginLeft: 10,
  },
  TextContainer: {
    flexDirection: "row",
    marginLeft: 38,
  },
});
export default styles;
