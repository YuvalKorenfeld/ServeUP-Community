import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
chatBar: {
    backgroundColor: "#8F8F93",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  selfChatBar: {
    backgroundColor: "#EEE",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    alignSelf: "flex-end",
    marginTop: 12,
  }
});
export default styles;