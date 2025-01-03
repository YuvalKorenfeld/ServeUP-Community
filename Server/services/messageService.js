import messageModel from "../models/messageModel.js";
import chatModel from "../models/chatModel.js";
import userService from "./userService.js";
import UserModel from "../models/userModel.js";
import messageSockets  from "./socketService.js";
const {socketSendMessage} = messageSockets;
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

const sendNotification = async (notification) => {
  try {
    const receipts = await expo.sendPushNotificationsAsync([notification]);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};


async function sendMessage(chatId, username, message) {
  const getUser = await userService.getFullUserDetails(username);
  // fetch all the chats from the database
  const chat = await chatModel.findById(chatId);
  // check if the user is a part of the chat
  if (!chat.users.includes(getUser._id)) {
    throw new Error("Unauthorized");
  }
  const recieverID = chat.users.find((user) => user._id.toString() !== getUser._id.toString());
  const reciever = await UserModel.findById(recieverID);
  // create a new message
  const newMessage = new messageModel({
    chat: chatId,
    sender: getUser,
    content: message,
  });
  // save the message to the database
  const savedMessage = await newMessage.save();
  // add the message to the chat
  chat.messages.push(savedMessage);
  // save the chat
  await chat.save();

  savedMessage.sender = getUser.username;
  // use socket.io to send the message to the other user
  socketSendMessage(chatId, reciever.username , {
    id: savedMessage._id.toString(),
    sender: getUser.username,
    content: savedMessage.content,
    created: savedMessage.created,
  });

  const user1 = await UserModel.findById(chat.users[0]._id);
  const user2 = await UserModel.findById(chat.users[1]._id);

  const notifiedUser = user1.username===username?user2:user1;

  if (notifiedUser.lastConnectedDevice !== " ") {
  
    // Replace with the Expo Push Token of the recipient device
    //insert to the brackets the lastConnectedDevice of the user
     
    const recipientExpoPushToken = notifiedUser.lastConnectedDevice;
    const title = 'New Message from ' + getUser.displayName + '!';
    //cut only first 20 chars of the message
    const body = message.length > 40 ? message.substring(0, 40) + "..." : message;
    // create token string from 
  
    const notification = {
      to: recipientExpoPushToken,
      title: title,
      body: body,
    };
  
    sendNotification(notification);
  }

  return {
    id: savedMessage._id.toString(),
    sender: getUser.username,
    content: savedMessage.content,
    created: savedMessage.created,
  };
}

async function getMessages(chatId, username) {
  var messages = [];
  const chat = await chatModel.findById(chatId);
  const userPromises = chat.users.map(async (user) => {
    try {
      const userDetails = await UserModel.findById(user._id);

      return {
        username: userDetails.username,
        displayName: userDetails.displayName,
        profilePic: userDetails.profilePic,
      };
    } catch (error) {
      throw error;
    }
  });
  var users = await Promise.all(userPromises);
  if (!users.find((u) => u.username === username)) {
    throw new Error("Unauthorized");
  }
  if (chat.messages.length === 0) {
    return messages;
  }
  const getMessages = async function (chat) {
    const messagePromises = chat.messages.map(async (message) => {
      try {
        const messageDetails = await messageModel.findById(message._id);
        const senderDetails = await UserModel.findById(messageDetails.sender);
        return {
          id: messageDetails._id.toString(),
          sender: senderDetails.username,
          content: messageDetails.content,
          created: messageDetails.created,
        };
      } catch (error) {
        throw error;
      }
    });
    const returnValue = await Promise.all(messagePromises);
    return returnValue;
  };
  messages = await getMessages(chat);
  return messages;
}

export default { sendMessage, getMessages };
