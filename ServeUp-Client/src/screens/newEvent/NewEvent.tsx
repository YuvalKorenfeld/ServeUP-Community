import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header/Header";
import CustomModal from "../../components/modal/Modal";
import styles from "./Styles";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect } from "react";
import config from "../../../helpers/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewEventScreen = ({ navigation }: any) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [date, setDate] = useState(new Date(Date.now()));
  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState(null);
  const [cityItems, setCityItems] = useState([]);
  const [myUserId, setMyUserId] = useState("");
  const isPublishButtonClickable = cityValue !== null && date !== null;
  const showMode = (currentMode: string) => {
    setShow(true);
    setMode(currentMode);
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

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
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const username = await AsyncStorage.getItem("username");
    const myResponse = await fetch(
      `${config.serverAddress}/api/Users/${username}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const myData = await myResponse.json();
    setMyUserId(myData._id);
  }

  const handlePublish = async() => {
    const adminCode = apiCityData.find(city => city.name === cityValue).adminCode;
    const city = apiCityData.find(city => city.name === cityValue).name;
    try {
      const token =await AsyncStorage.getItem("userToken");  // Replace with your actual access token
      const username =await AsyncStorage.getItem("username");  // Replace with your actual username


      const response = await fetch(
        `${config.serverAddress}/api/Users/${username}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        //create another fetch to get the user id
        const myResponse = await fetch(
          `${config.serverAddress}/api/Users/${username}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const myData = await myResponse.json();
        setMyUserId(myData._id);

        const location = {name: city, adminCode: adminCode}
        const postData = {date: date, location: location, player: myUserId}
          //create a post request to create a new meeting
          const newMeetingResponse = await fetch(
            `${config.serverAddress}/api/posts`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(postData),
            }
          );
          if (newMeetingResponse.ok) {
            navigation.goBack();
          }
          else {
            console.error("Failed to create new meeting");
          }
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error while fetching user data:", error);
    }
  };

  const formatDate = (inputDate) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return inputDate.toLocaleDateString('en-GB', options);
  };
  return (
    <View style={[styles.container]}>
      <Header />
      <Text style={[styles.title, { marginBottom: 20 }]}>Create a new meeting</Text>

      <DropDownPicker
        searchable={true}
        zIndex={3}
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
      <View style={styles.mainView}>
        <TouchableOpacity style={[styles.date, { zIndex: 1 }]} onPress={() => showMode("date")}>
          <Text style={styles.inputFieldText}>
          {formatDate(date)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.time, { zIndex: 1 }]} onPress={() => showMode("time")}>
          <Text style={styles.inputFieldText}>
            {date
              .toLocaleString()
              .substring(date.toLocaleString().indexOf(" "))}
          </Text>
        </TouchableOpacity>
      </View>
      {isPublishButtonClickable ? (
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => handlePublish()}
        >
          <Text style={styles.signupBtnText}>Publish New Game Proposal</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.signupBtn, { backgroundColor: "#777777" }]}>
          <Text style={[styles.signupBtnText, { color: "#333333" }]}>
            Enter location and date
          </Text>
        </View>
      )}

      <CustomModal
        animationType="slide"
        transparent={true}
        visible={show}
        dismiss={() => {
          setShow(!show);
        }}
      >
        <View
          style={{ backgroundColor: "#8F8F93", borderRadius: 16, padding: 16 }}
        >
          <DateTimePicker
            minimumDate={new Date()}
            value={date}
            mode={mode as any}
            onChange={onChange}
            display={mode == "time" ? "spinner" : "inline"}
          />
        </View>
      </CustomModal>
    </View>
  );
};

export default NewEventScreen;
