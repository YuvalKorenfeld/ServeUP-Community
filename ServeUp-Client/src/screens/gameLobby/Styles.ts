import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    backButton: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 1,
    },
    headerText: {
      fontSize: 32,
      color: '#D5FF45',
      fontFamily: 'semiBold',
    },
    middleContainer: {
      marginTop: 30,
    },
    rectangle: {
      marginTop: 30,
      width: 346,
      height: 208,
      backgroundColor: '#343434',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
  
      shadowColor: '#8F8F93',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 3,
    },
    profilePic: {
      width: 95,
      height: 95,
      borderRadius: 47.5,
    },
    playText: {
      color: 'white',
      fontFamily: 'semiBold',
      marginTop: 25,
      fontSize: 25,
  
    },
    startNewOperationButton: {
      marginTop: 15,
      padding: 10,
      borderRadius: 16,
      width: 327,
      height: 55,
      backgroundColor: '#D5FF45',
      alignItems: 'center',
      justifyContent: 'center',
    },
    startNewOperationText: {
      fontFamily: 'semiBold',
      fontSize: 15,
    },
    button: {
      width: 30,
      height: 30,
      marginTop: 10,
      padding: 10,
      backgroundColor: "#162529",
      borderRadius: 5,
      fontFamily: 'semiBold',
    },
    instructionsContainer: {
      marginTop: 50,
      alignItems: 'center',
    },
    instructionsText: {
      marginTop: 30,
      color: '#8F8F93',
      fontSize: 15,
      textAlign: 'center',
      fontFamily: 'semiBold',
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginTop: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    // New styles for the custom alert
  alertContainer: {
    backgroundColor: "#162529",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#636363",
  },
  alertTitle: {
    fontFamily: "semiBold",
    fontSize: 24,
    color: "#EEE",
    marginBottom: 8,
  },
  alertMessage: {
    fontFamily: "medium",
    fontSize: 16,
    color: "#EEE",
    marginBottom: 16,
  },
  alertButton: {
    height: 40,
    backgroundColor: "#D5FF45",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  alertButtonText: {
    fontFamily: "semiBold",
    color: "#000",
    fontSize: 16,
  },
  });
  export default styles;
