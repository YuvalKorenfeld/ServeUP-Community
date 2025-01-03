import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Person from "../../../assets/Person.svg";
import Header from "../../components/header/Header";
import styles from "./Styles";
import Modal from "react-native-modal";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

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
          <Text style={styles.alertButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const SignupScreen = ({ navigation }: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  
  // Generate an array of age values from 16 to 99
  const generateAgeItems = () => {
    const ageItems = [];
    for (let i = 16; i <= 99; i++) {
      ageItems.push({ label: `${i}`, value: `${i}` });
    }
    return ageItems;
  };
  
  // Set initial age items using the function
  const [items, setItems] = useState(generateAgeItems());

  const [apiCityData, setApiCityData] = useState([]);

  // Function to fetch city data from the API
  const fetchCityData = async () => {
    try {
      const response = await fetch(
        'https://parseapi.back4app.com/classes/Israelcities_City?limit=1000&order=name&keys=name,adminCode',
        {
          headers: {
            'X-Parse-Application-Id': 'yTikTB1eWHWu8fntgioQCSGJbMoZB5hacnQotiNA',
            'X-Parse-REST-API-Key': '3KWAURPh9rnIHjSoLoWcfk9xz0IM3ZTC1itmbv5n',
          }
        }
      );
      const data = await response.json();
      data.results = data.results.filter((city) => city.adminCode !== "");
      setApiCityData(data.results); // Assuming the city data is stored in the "results" property
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  // useEffect to fetch city data when the component mounts
  useEffect(() => {
    fetchCityData();
  }, []);

  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState(null);
  const [cityItems, setCityItems] = useState([]);

  const determineValidationMessage = () => {
    let errorMessages = "";
    if (!username) {
      return "Username is required.";
    }
    if (isUsernameTaken) {
      return "Username is already taken.";
    }
    if (!value) {
      return "Age is required.";
    }
    if (!displayName) {
      return "Display Name is required.";
    }
    if (!cityValue) {
      return "City is required.";
    }
    if (!password) {
      return "Password is required.";
    }
    if (!repeatPassword) {
      return "Repeat Password is required.";
    }
    if (password !== repeatPassword) {
      return "Passwords do not match.";
    }
    if (!/(?=.*[A-Z])/.test(password)){
      errorMessages = "Password must contain at least one uppercase letter.\n";
    } 
    if (!/(?=.*[a-z])/.test(password)){
      errorMessages += "Password must contain at least one lowercase letter.\n";
    }
    if (!/(?=.*[0-9])/.test(password)){
      errorMessages += "Password must contain at least one digit.\n";
    }

    if (errorMessages !== ""){
      return errorMessages;
    } 
    return "Please fill in all fields and choose a photo before continuing.";
  };
  
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);

  const cleanStates = () => {
    setAlertVisible(false);
    setIsUsernameTaken(false);
  }

  const handleContinue = async () => {
    // Perform validations
    if (!username || !displayName || !cityValue || !password || !repeatPassword) {
      //do a check on each field and add it to the errorMessages object
      setAlertVisible(true);
    } else if (password !== repeatPassword) {
      setAlertVisible(true);
      // You can set a specific message for password mismatch if needed
    } else if (!value) {
      setAlertVisible(true);
    } 
    else if (!/(?=.*[A-Z])/.test(password)){
      setAlertVisible(true);
    }
    else if (!/(?=.*[a-z])/.test(password)){
      setAlertVisible(true);
    }
    else if (!/(?=.*[0-9])/.test(password)){
      setAlertVisible(true);
    }
    else {
      try {
        // Check if the username is already taken
        const response = await fetch(`${config.serverAddress}/api/Users/${username}/exist`);
        if (response.status === 409) {
          setIsUsernameTaken(true);
          setAlertVisible(true);
          return;
        }
  
        // Your logic to store data, navigate, etc.
        const adminCode = apiCityData.find(city => city.name === cityValue).adminCode;
        await AsyncStorage.setItem("userToken", "dummyToken");
        navigation.navigate("SignupContinueScreen", {
          age: value,
          username,
          displayName,
          city: cityValue, // Use the selected city value
          adminCode,
          password,
          profilePic: ""
        });
      } catch (e) {
        console.error("Error while setting token:", e);
      }
    } 
};

  return (
    <View style={[styles.container]}>
      <Header />

      <View>
        <Text style={styles.title}>Signup</Text>
      </View>
      <View style={styles.avatarViewContainer}>
        <View style={styles.avatarContainer}>
          <Person height={60} />
        </View>
      </View>

      <ScrollView style={styles.bodyContainer}>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#8F8F93"
            value={username}
            onChangeText={(text) => setUsername(text)}
            autoCapitalize="none"
          />
        </View>
        <DropDownPicker
        zIndex={1}
          listMode="SCROLLVIEW"
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={"Age"}
          style={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownDataContainer}
        />
                <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            placeholderTextColor="#8F8F93"
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
          />
        </View>
        <DropDownPicker
        searchable={true}
        zIndex={0}
        listMode="SCROLLVIEW"
        open={cityOpen}
        value={cityValue}
        items={apiCityData.map(city => ({ label: city.name, value: city.name }))}
        setOpen={setCityOpen}
        setValue={setCityValue}
        setItems={setCityItems}
        placeholder={"City"}
        style={styles.dropdownContainer2}
        textStyle={styles.dropdownText}
        dropDownContainerStyle={styles.dropdownDataContainer}
        searchPlaceholder="Search for a city..."
        searchTextInputStyle={{
          borderWidth: 0.5,
          borderColor: '#D5FF45',
          color: styles.dropdownText.color,
        }}
      />
        <View style={styles.inputField}>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8F8F93"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.inputField}>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Repeat Password"
            placeholderTextColor="#8F8F93"
            value={repeatPassword}
            onChangeText={(text) => setRepeatPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomAlert
        isVisible={isAlertVisible}
        title="Validation Error"
        message={determineValidationMessage()}
        onPress={() => cleanStates()}
      />
    </View>
  );
};

export default SignupScreen;