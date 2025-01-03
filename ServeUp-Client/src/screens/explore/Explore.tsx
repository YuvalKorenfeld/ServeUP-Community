import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import CustomModal from "../../components/modal/Modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import config from "../../../helpers/config";

const ExploreScreen = ({ navigation }: any) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [date, setDate] = useState(() => {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    return nextHour;
  });
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleCitySelect = (value) => {
    setCityValue(value);
    setIsCitySelected(true);
  };

  const showMode = (currentMode: string) => {
    if (currentMode === "date") {
      setShowDatePicker(true);
    } else if (currentMode === "time") {
      setShowTimePicker(true);
    } else {
      setShow(true);
    }
    setMode(currentMode);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;

    if (mode === "date") {
      setShowDatePicker(false);
    } else if (mode === "time") {
      setShowTimePicker(false);
    }

    setDate(currentDate);
  };

  const switchScreen = async () => {
    setShow(true);
    const username = await AsyncStorage.getItem("username");
    const adminCode = apiCityData.find(
      (city) => city.name === cityValue
    ).adminCode;
    const city = apiCityData.find((city) => city.name === cityValue).name;
    setShowDatePicker(false);
    setShowTimePicker(false);

    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString();

    setTimeout(() => {
      // Pass data to ProfileDetailScreen
      navigation.navigate("ProfileDetailScreen", {
        username: username,
        date: date.toISOString(),
        currentDate: formattedCurrentDate,
        location: {
          name: city,
          adminCode: adminCode,
        },
      });

      setTimeout(() => {
        setShow(false);
      }, 100);
    }, 2000);
  };

  const [apiCityData, setApiCityData] = useState([]);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState(null);
  const [cityItems, setCityItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState("");

  const formatDate = (inputDate) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return inputDate.toLocaleDateString("en-GB", options);
  };

  // Function to fetch city data from the API
  const fetchCityData = async () => {
    try {
      const response = await fetch(
        "https://parseapi.back4app.com/classes/Israelcities_City?limit=1000&order=name&keys=name,adminCode",
        {
          headers: {
            "X-Parse-Application-Id":
              "yTikTB1eWHWu8fntgioQCSGJbMoZB5hacnQotiNA",
            "X-Parse-REST-API-Key": "3KWAURPh9rnIHjSoLoWcfk9xz0IM3ZTC1itmbv5n",
          },
        }
      );
      const data = await response.json();
      data.results = data.results.filter((city) => city.adminCode !== "");
      setApiCityData(data.results); // Assuming the city data is stored in the "results" property
      fetchData();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Replace with your actual access token
      const username = await AsyncStorage.getItem("username"); // Replace with your actual username
      const userProfilePicSrc = await AsyncStorage.getItem("userProfilePicSrc"); // Replace with your actual username`
      setImageSource(userProfilePicSrc);
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
        const data = await response.json();
        setUserData(data);
        setCityValue(data.location.name);
      } else {
        console.error("Failed to fetch user data");
        console.error(response.json());
      }
    } catch (error) {
      console.error("Error while fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={styles.mainView}>
        <Text style={styles.title}>The Magic Algorithm</Text>
        <Text style={styles.desp}>Get your perfect game match</Text>
        <ImageBackground
          style={styles.bg}
          source={require("../../../assets/Eclipse.png")}
        >
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                imageSource
                  ? { uri: imageSource }
                  : require("../../../assets/userProfilePic.png")
              }
            />
          </View>
        </ImageBackground>
      </View>

      <View style={styles.rowContainer}>
        {/* First Row */}
        <View style={styles.row}>
          <DropDownPicker
            searchable={true}
            zIndex={3}
            listMode="SCROLLVIEW"
            open={cityOpen}
            value={cityValue}
            items={apiCityData.map((city) => ({
              label: city.name,
              value: city.name,
            }))}
            setOpen={setCityOpen}
            setValue={setCityValue}
            setItems={setCityItems}
            placeholder={userData?.location?.name || "Select a city"}
            style={styles.dropdownContainer2}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownDataContainer}
            searchPlaceholder="Search for a city..."
            searchTextInputStyle={{
              borderWidth: 0.5,
              borderColor: "#D5FF45",
              color: styles.dropdownText.color,
            }}
          />
        </View>

        {/* Second Row */}
        <View style={[styles.row, { zIndex: -1 }]}>
          <TouchableOpacity
            style={[styles.date, { zIndex: 1 }]}
            onPress={() => showMode("date")}
          >
            <Text style={styles.inputFieldText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.time, { zIndex: 1 }]}
            onPress={() => showMode("time")}
          >
            <Text style={styles.inputFieldText}>
              {date
                .toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                .substring(0, 5)}{" "}
              {/* Take only the first 5 characters to get 'hh:mm' */}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={switchScreen}
        disabled={loading}
      >
        {show ? (
          <Image
            style={{ width: "40%", height: "100%", alignSelf: "center" }}
            source={require("../../../assets/spinner.gif")}
          />
        ) : (
          <Text style={styles.continueBtnText}>Let’s Find A Partner</Text>
        )}
      </TouchableOpacity>

      {/* Date Picker */}
      <CustomModal
        animationType="slide"
        transparent={true}
        visible={showDatePicker}
        dismiss={() => {
          setShowDatePicker(false);
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
            display="inline"
          />
        </View>
      </CustomModal>

      {/* Time Picker */}
      <CustomModal
        animationType="slide"
        transparent={true}
        visible={showTimePicker}
        dismiss={() => {
          setShowTimePicker(false);
        }}
      >
        <View
          style={{ backgroundColor: "#8F8F93", borderRadius: 16, padding: 16 }}
        >
          <DateTimePicker
            minimumDate={new Date()}
            value={date}
            mode="time"
            is24Hour={true}
            onChange={onChange}
            display="spinner"
          />
        </View>
      </CustomModal>
    </View>
  );
};

export default ExploreScreen;
