import UserModel from '../models/userModel.js';
import friendRequestModel from '../models/friendRequestModel.js';
import storageService from './storageService.js';
const createFriendRequest = async (friendRequestData) => {
    try {
        //check if friend request already exists
        const friendRequest = await friendRequestModel.findOne({fromUser: friendRequestData.fromUser, toUser: friendRequestData.toUser});
        if(friendRequest){
            return { status: 400, body: { message: "Friend request already exists" } };
        }
        //check if user is already friends
        const user = await UserModel.findById(friendRequestData.fromUser);
        const friend = await UserModel.findById(friendRequestData.toUser);
        if(user.friends.includes(friend._id)){
            return { status: 400, body: { message: "You are already friends" } };
        }
        //check if user already sent me a friend request
        const friendRequest2 = await friendRequestModel.findOne({fromUser: friendRequestData.toUser, toUser: friendRequestData.fromUser});
        if(friendRequest2){
            return { status: 400, body: { message: "User already sent you a friend request" } };
        }

      const newFriendRequest= new friendRequestModel({
        fromUser: friendRequestData.fromUser,
        toUser: friendRequestData.toUser,
        createdAt: friendRequestData.createdAt,
      });
      const savedFriendRequest = await newFriendRequest.save();
      return { status: 201 };
    } catch (error) {
      return { error: error.message, status: 500 };
    }
}

//this will only show the users which I sent a friend request to
const getSentFriendRequests = async (username) => {
    try {
        const user = await UserModel.findOne({username: username});
        const friendRequests = await friendRequestModel.find({fromUser: user._id});
        const output = [];
        for (const friendRequest of friendRequests) {
            const friendRequestObject = {
                id: friendRequest._id.toString(),
                fromUser: friendRequest.fromUser,
                toUser: friendRequest.toUser,
                createdAt: friendRequest.createdAt,
            };
            try {
                // Fetch player details directly from the post.player field
                const playerDetails = await UserModel.findById(friendRequest.toUser);
                friendRequestObject.toUser = {
                    id: playerDetails._id.toString(),
                    username: playerDetails.username,
                    displayName: playerDetails.displayName,
                    profilePic: playerDetails.profilePic,
                    age: playerDetails.age,
                    realLevel: playerDetails.realLevel,
                    level: playerDetails.level,
                };
            } catch (error) {
                throw error;
            }
            output.push(friendRequestObject);
        }
        return output;
    } catch (error) {
        // Throw the error instead of using res.status (as res is not defined here)
        throw error;
    }
}

//this will only show the users which sent me a friend request
const getMyFriendRequests = async (username) => {
    try {
        const user = await UserModel.findOne({username: username});
        const friendRequests = await friendRequestModel.find({toUser: user._id});
        const output = [];
        for (const friendRequest of friendRequests) {
            const friendRequestObject = {
                id: friendRequest._id.toString(),
                fromUser: friendRequest.fromUser,
                toUser: friendRequest.toUser,
                createdAt: friendRequest.createdAt,
            };
            try {
                // Fetch player details directly from the post.player field
                const playerDetails = await UserModel.findById(friendRequest.fromUser);
                friendRequestObject.fromUser = {
                    id: playerDetails._id.toString(),
                    username: playerDetails.username,
                    displayName: playerDetails.displayName,
                    profilePic: await storageService.getProfilePicUrl(playerDetails.profilePic),
                    age: playerDetails.age,
                    realLevel: playerDetails.realLevel,
                    level: playerDetails.level,
                };
            } catch (error) {
                throw error;
            }
            output.push(friendRequestObject);
        }
        return output;
    } catch (error) {
        // Throw the error instead of using res.status (as res is not defined here)
        throw error;
    }
}

const deleteFriendRequest = async (fromUser, toUser) => {
    try {
        const sendUser = await UserModel.findById(fromUser);
        const receiveUser = await UserModel.findById(toUser);
        const friendRequest = await friendRequestModel.findOne({fromUser: sendUser, toUser: receiveUser});
        if(!friendRequest){
            return { status: 400, body: { message: "Friend request does not exist" } };
        }
        await friendRequestModel.deleteOne({fromUser: fromUser, toUser: toUser});
        return { status: 200 };
    } catch (error) {
        return { error: error.message, status: 500 };
    }
}

const approveFriendRequest = async (fromUser, toUser) => {
    try {
        const sendUser = await UserModel.findById(fromUser);
        const receiveUser = await UserModel.findById(toUser);
        const friendRequest = await friendRequestModel.findOne({fromUser: sendUser, toUser: receiveUser});
        if(!friendRequest){
            return { status: 400, body: { message: "Friend request does not exist" } };
        }
        await friendRequestModel.deleteOne({fromUser: fromUser, toUser: toUser});
        await UserModel.findByIdAndUpdate(fromUser, {$push: {friends: toUser}});
        await UserModel.findByIdAndUpdate(toUser, {$push: {friends: fromUser}});
        return { status: 200 };
    } catch (error) {
        return { error: error.message, status: 500 };
    }
}


export default {createFriendRequest,getSentFriendRequests,getMyFriendRequests, deleteFriendRequest, approveFriendRequest};