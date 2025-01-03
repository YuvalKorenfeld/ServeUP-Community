import { StyleSheet } from "react-native";
const styles =StyleSheet.create({
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
        marginTop: 16,
        height: 40,
        backgroundColor: "#D5FF45",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    closeButton:{
        marginTop: 16,
        height: 40,
        backgroundColor: "#808080",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    alertButtonText: {
        fontFamily: "semiBold",
        color: "#000",
        fontSize: 16,
    },
    iconTextContainer: {
        flexDirection: "row",
        alignItems: "center", // Add this line to align items vertically
        marginLeft: 12,
    }
});

export default styles;
