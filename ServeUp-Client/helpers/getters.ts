import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "./config";
export const fetchChatID = async(username:string) => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Replace with your actual access token

      const response = await fetch(
        `${config.serverAddress}/api/Chats/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
          },
          body: JSON.stringify({
            username: username
          }),
        }
      );
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
export const getPlayerBG = (level: number) => {
  try {
    switch (level) {
      case 0:
        return require(`../assets/bg_1.png`);
    case 1:
      return require(`../assets/bg_2.png`);
    case 2:
      return require(`../assets/bg_3.png`);
    case 3:
      return require(`../assets/bg_4.png`);
    case 4:
      return require(`../assets/bg_5.png`);
    case 5:
      return require(`../assets/bg_6.png`);
    case 6:
      return require(`../assets/bg_7.png`);
    case 7:
      return require(`../assets/bg_8.png`);
    default:  
      return require(`../assets/bg_1.png`);
    }
  }
  catch{
  return require(`../assets/bg_1.png`);
}
}