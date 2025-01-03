import React, { useState, useEffect, Component,useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, Alert } from "react-native";
import { useFonts } from "expo-font";
import BackIcon from "../../../assets/BackIcon.svg";
import Modal from "react-native-modal";
interface CustomAlertProps {
  isVisible: boolean;
  title: string;
  message: string;
  onPress: () => void;
}
const CustomAlert: React.FC<CustomAlertProps> = ({ isVisible, title, message, onPress }) => {
  return (
    <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut">
      <View style={styles.alertContainer}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <TouchableOpacity style={styles.alertButton} onPress={onPress}>
          <Text style={styles.alertButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

import {
  StyleSheet,
  Text,
  View,
  Image,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import socketModule from "../../../helpers/messageSocket";
import styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FlagEvents = new NativeEventEmitter(NativeModules.RNEventEmitter);


const GameLobbyScreen = ({ navigation, setLoader, loaderBodyContent,route }: any) => {

  const [isAlertVisible, setAlertVisible] = useState(false);
  const showAlert = () => {
    setAlertVisible(true);
  };

  const {uname,image,name} = route.params;
    const socketRef = useRef(null);
    
    const myPlayer = useRef({username:""});
    const convertedProfilePic = useRef("nopic"); 
    
    const initSocket = (token) => {
      try{
      socketRef.current = socketModule.getSocketInstance();
      }catch(error){
        socketRef.current = socketModule.initializeSocket(token);
      }
  
      socketRef.current.on("identify", (data) => {
        socketRef.current.emit("token", "bearer " + token);
      });
  
      socketRef.current.on("requestGame", (data) => {
        NativeModules.RNServeup.addEvent("new", "operation");

        showAlert();
      });
  
      socketRef.current.on("gameCreated", (data) => {
        const dataObject = JSON.parse(data);
        const opponent = dataObject.opponent; 
  
        NativeModules.RNServeup.addEvent("new", "operation");
        NativeModules.RNServeup.addEvent(name,convertedProfilePic.current);
      });
  
      socketRef.current.on("pointReceived", (data) => {
        NativeModules.RNServeup.addEvent("inc", "score");
      });
  
  
      socketRef.current.on("playAnotherSetReceived", (data) => {
        NativeModules.RNServeup.addEvent("playAnotherSet", "Navigation");
      });
      socketRef.current.on("submitGameReceived", (data) => {
        NativeModules.RNServeup.addEvent("submitGame", "Navigation");
      });
      socketRef.current.on("viReceived", (data) => {
        NativeModules.RNServeup.addEvent("vi", "Navigation");
      });
      socketRef.current.on("pauseReceived", (data) => {
        NativeModules.RNServeup.addEvent("pause", "Navigation");
      });
      socketRef.current.on("continuePlayReceived", (data) => {
        NativeModules.RNServeup.addEvent("continuePlay", "Navigation");
      });
      
    };
  
    //the image need to be in size 500x500
    const convert = () => {
      const imageToConvert = image?image:"https://images.augustman.com/wp-content/uploads/sites/2/2023/07/14132108/360080030_18375613075053164_2178571424194143586_n-1-500x500.jpeg"
      ReactNativeBlobUtil.fetch(
        "GET",
        imageToConvert
      )
        .then((res) => {
          let status = res.info().status;
  
          if (status === 200) {
            let base64Str = res.base64();
            //setProfilePicBase64(base64Str); // Set the base64 string to the state
            convertedProfilePic.current = base64Str;
          } else {
            // handle other status codes
          }
        })
        // Something went wrong:
        .catch((err) => {
          // error handling
          console.log(err);
        });
    };
  const getUsername = async () => {
    const myUsername = await AsyncStorage.getItem("username");
    myPlayer.current.username = myUsername;
  }
const setSocket = async () => {
const token = await AsyncStorage.getItem("token");
initSocket(token);
}
    useEffect(() => {

      convert();
      getUsername();
      setSocket();
    }, []);
  
    useEffect(() => {
      const onSentListener = (result) => {
        //("gotaaa meseggeee!!!!!!", result);
        try {
          NativeModules.RNServeup.findEvents((resp) => {
            if (resp === "playAnotherSet"){
              socketRef.current.emit("playAnotherSet",myPlayer.current.username);
              return;
            }
            if (resp === "submitGame"){
              socketRef.current.emit("submitGame",myPlayer.current.username);
              return;
            }
            if (resp === "vi"){
              socketRef.current.emit("vi",myPlayer.current.username);
              return;
            }
            if (resp === "pause"){
              socketRef.current.emit("pause",myPlayer.current.username);
              return;
            }
            if (resp === "continuePlay"){
              socketRef.current.emit("continuePlay",myPlayer.current.username)
              return;
            }
  
            if (resp==="1"){
                socketRef.current.emit("point",myPlayer.current.username);
            }else{
              socketRef.current.emit("endGame",JSON.stringify({username:myPlayer.current.username,result:resp}));
            }
          });
        } catch (error) {
          console.error("Error in handleMekabelMeXcode:", error);
        }
      };
    
      FlagEvents.addListener("onSent", onSentListener);
    
      return () => {
        //FlagEvents.removeListener("onSent", onSentListener);
      };
    }, []);
  
    const handleStartNewOperation = () => {
      NativeModules.RNServeup.addEvent("new", "operation");
      
      socketRef.current.emit(
        "startGame",
        JSON.stringify({
          me: myPlayer.current.username,
          opponent:uname
        })
      );
  
    };

    const handleOKButtonInAlert = () => {
      NativeModules.RNServeup.addEvent("new", "operation");
      socketRef.current.emit(
        "acceptGame",
        JSON.stringify({
          me: myPlayer.current.username,
          opponent:uname
        })
      );
      setAlertVisible(false)
    };

    return (
      <View style={[styles.container, { backgroundColor: '#162529' }]}>
         <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.backButton}
          >
            <BackIcon />
          </TouchableOpacity>
        <Text style={styles.headerText}>Live Game Lobby Room</Text>
    
        <View style={styles.middleContainer}>
          <View style={styles.rectangle}>
            <Image source={image?{uri:image}:require("../../../assets/userProfilePic.png")} style={styles.profilePic} />
            <Text style={styles.playText}>Play against {name}</Text>
          </View>
        </View>
    
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Open the app on your Apple Watch{'\n'}and press the button to invite the opponent
          </Text>
        </View>


        {/* <TouchableOpacity
          style={styles.startNewOperationButton}
          onPress={()=>{ NativeModules.RNServeup.addEvent("new", "operation"); }}
        >
          <Text style={styles.startNewOperationText}>Connect To Apple Watch</Text>
        </TouchableOpacity> */}


        <TouchableOpacity
          style={styles.startNewOperationButton}
          onPress={handleStartNewOperation}
        >
          <Text style={styles.startNewOperationText}>Invite Opponent To Match</Text>
        </TouchableOpacity>

        <CustomAlert
        isVisible={isAlertVisible}
        title="Let's play"
        message="Open the Apple Watch app and press the confirmation button"
        onPress={handleOKButtonInAlert}
      />
  
        <StatusBar style="auto" />
      </View>
    );
    
  }
    export default GameLobbyScreen;