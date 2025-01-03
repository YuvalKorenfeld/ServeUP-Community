import { Text,View,TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import PictureIcon from "../../../../assets/PictureIcon.svg"
import * as ImagePicker from 'expo-image-picker';
import styles from "./Styles";
import { useState } from "react";
import config from "../../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface ChooseImageAlertProps {
    isVisible: boolean;
    setNewImageUri: (uri: string) => void;
    onPress: () => void;
  }


const ChooseImageAlert: React.FC<ChooseImageAlertProps> = ({ isVisible, onPress,setNewImageUri }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const onImageClick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Handle the selected image, for example, display it in an Image component
        setSelectedImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri,2);
        onPress();

      }
    } catch (error) {
      console.error('Error picking an image', error);
    }
  };
  const uploadImage = async (uri: string,retry:number) => {
    if(retry==0){
      throw new Error("Failed to upload image to server");
    }
  const token = await AsyncStorage.getItem('userToken');
  const username = await AsyncStorage.getItem('username');
  const formData = new FormData();

  try {
    let type = uri.substring(uri.lastIndexOf(".") + 1);
    // Append the file to formData
    formData.append('image', { uri, name: `${username}.${type}`, type: `image/${type}` } as any)
    const response = await fetch(`${config.serverAddress}/api/Users/ProfilePic`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },      
    });
    if (response.ok) {
      const responseData = await response.json();
      setNewImageUri(responseData.profilePic);
      
    } else {
      console.error('Failed to upload image. Server returned:', response.status, response.statusText);
    }
  } catch (error) {
    uploadImage(uri,retry-1)
  }
};

    return (
      <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut">
        <View style={styles.alertContainer}>
        <TouchableOpacity style={styles.alertButton}  onPress={onImageClick}>
            <View style={styles.iconTextContainer}>
     
              <Text style={styles.alertButtonText}>Choose from library</Text>
              
              </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onPress}>
            <Text style={styles.alertButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
export default ChooseImageAlert;