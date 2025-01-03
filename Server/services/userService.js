import UserModel from '../models/userModel.js';
import tokenService from './tokenService.js';
import postService from './postService.js';
import gameService from './gameService.js';
import storageService from './storageService.js';
import friendRequestModel from '../models/friendRequestModel.js';
const createUser = async (username, password,email,displayName, profilePic,age, location, realLevel) => {
    try {
      // check if the username is already taken
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return { error: 'Username is already taken', status: 409 };
      }
      const newUser= new UserModel({
        username,
        password,
        email,
        displayName,
        profilePic,
        age,
        location: {"name":location.name,"adminCode":location.adminCode},
        realLevel
      });
      await newUser.save();
      const tokenReq = await tokenService.getToken(username,password);
      return { status: 201 ,body:{authorization:"Bearer "+tokenReq.token}};
    } catch (error) {
      return { error: error.message, status: 500 };
    }
    
};
const isLoginValid = async (username,password) => {
    const existingUser = await UserModel.findOne({ username, password });
      if (existingUser) {
        return true;
      }
      return false;
  };
  const getUserDetails = async(username)=>{
    const user= await UserModel.findOne({username});
    return {username:user.username,displayName:user.displayName,profilePic:user.profilePic,level:user.level};
  }
  const getFullUserDetails = async (username) => {
    try {
      const user = await UserModel.findOne({ username });
  
      if (user) {
        // Exclude the password and __v fields from the user object
        const { password, __v, friends,location,level, ...userDetails} = user.toObject();
  
        // Fetch details of each friend
        const friendDetails = await Promise.all(
          friends.map(async (friendId) => {
            const friend = await UserModel.findById(friendId)
              .select({ password: 0, __v: 0 ,friends:0}) // Exclude password __v and friends fields
            const friendObject = friend.toObject();
            return friendObject;
          })
        );
  
        userDetails.friends = friendDetails;
        userDetails.location = location;
        userDetails.level = level;
        if(userDetails.profilePic){
          const profilePicUrl = await storageService.getProfilePicUrl(userDetails.profilePic);
          userDetails.profilePic = profilePicUrl;
        }
  
        return userDetails;
      } else {
        // Handle the case where the user is not found
        return null;
      }
    } catch (error) {
      // Handle any errors that occurred during the database query
      console.error('Error fetching user details:', error);
      throw error;
    }
  };
  const deleteUser = async(username)=>{
      try{
        await UserModel.deleteOne({username});
        return {status:200};
      }catch(error){
        return {error:error.message,status:500};
      }
    }
const getUserID = async (username)=>{
  const user = await UserModel.findOne({username});
  if(!user){
    throw new Error("User not found");
  }
  return user._id;
}

const updateUserInfo = async (username,updatedInfo)=>{
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await UserModel.updateOne({ username }, { $set: updatedInfo });
    const updatedUser = await getFullUserDetails(username);
    return updatedUser;
  } catch (error) {
    return { error: error.message, status: 500 };
  }
}

const getUserPerfectMatch = async (username, date, location, currentDate)=>{
  try {
    let maxUserKey = null;
    let maxPost = null;
    let maxPercentage = 0;
    let matchingPercentage = 0;  

    const userMap = new Map();
    const user = await getFullUserDetails(username);
    const posts = await postService.getPosts(username);

    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    for (const post of posts){
      //if the post date is before the current date so continue
      const currentDateObj = new Date(currentDate);
      if (post.date.getTime() < currentDateObj.getTime()) {
        continue;
      }
      
      matchingPercentage = 0;
      const userKey = post.player;

      /*
      date = 0-20
      location = 0-30
      age = 0-15
      level = 0-25
      realLevel = 0-10
      */

      // Calculate matching percentage based on date (0 to 20 points)
      const timeDifference = Math.abs(post.date.getTime() - date.getTime());
      const oneDayInMillis = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
      const oneHourInMillis = 60 * 60 * 1000; // Number of milliseconds in an hour


      if (timeDifference <= oneHourInMillis) {
        // Exact same date and time
        matchingPercentage += 20;
      } else if (timeDifference <= 2 * oneHourInMillis) {
        // Within 2 hours difference
        matchingPercentage += 15;
      } else if (timeDifference <= oneDayInMillis) {
        // Same day but different time
        matchingPercentage += 10;
      } else if (timeDifference <= 2 * oneDayInMillis) {
        // Within 2 days difference
        matchingPercentage += 5;
      } else {
        // More than 2 days difference
        matchingPercentage += 0;
      }

      const isLocationMatch =
        post.location.name === location.name &&
        post.location.adminCode === location.adminCode;

      // Calculate matching percentage based on location (0 to 30 points)
      if (isLocationMatch) {
        matchingPercentage += 30;
      } else if (post.location.adminCode === location.adminCode) {
        // Only admin code matches
        matchingPercentage += 15; // You can adjust this based on your specific logic
      }


      // Calculate matching percentage based on age (0 to 15 points)
      const ageDifference = Math.abs(post.player.age - user.age);
      if (ageDifference === 0) {
        // Exact same age
        matchingPercentage += 15;
      } else if (ageDifference <= 2) {
        // Within 2 years difference
        matchingPercentage += 10;
      } else if (ageDifference <= 5) {
        // Within 5 years difference
        matchingPercentage += 5;
      } else {
        // More than 5 years difference
        matchingPercentage += 0;
      }


      // Calculate matching percentage based on level (0 to 25 points)
      const levelDifference = Math.abs(post.player.level - user.level);
      if (levelDifference === 0) {
        // Exact same level
        matchingPercentage += 25;
      } else if (levelDifference === 1) {
        // One level difference
        matchingPercentage += 20;
      } else if (levelDifference === 2) {
        // Two levels difference
        matchingPercentage += 10;
      } else {
        // More than two levels difference
        matchingPercentage += 0;
      }


      // Calculate matching percentage based on level the user think he is (0 to 10 points)
      const userLevelDifference = Math.abs(post.player.realLevel - user.realLevel);
      if (userLevelDifference === 0) {
        // Exact same level
        matchingPercentage += 10;
      } else if (userLevelDifference === 1) {
        // One level difference
        matchingPercentage += 5;
      } else if (userLevelDifference === 2) {
        // Two levels difference
        matchingPercentage += 2;
      } else {
        // More than two levels difference
        matchingPercentage += 0;
      }


      if (userMap.has(userKey)) {
        const existingPair = userMap.get(userKey);
        if (existingPair.matchingPercentage < matchingPercentage) {
          userMap.set(userKey, { matchingPercentage, post });
        }
      }
      else {
        userMap.set(userKey, { matchingPercentage, post });
      }

      if (matchingPercentage > maxPercentage) {
        maxUserKey = userKey;
        maxPost = post;
        maxPercentage = matchingPercentage;
      }
  } /*for*/
  if(maxUserKey==null){ //there are no matches
    return {matchingUser:null,maxPost:null,maxPercentage:null};
  }

  const matchingUser = await getFullUserDetails(maxUserKey.username);
  return {matchingUser,maxPost,maxPercentage};
}
catch(error){
  return { error: error.message, status: 500 };
}
}


const updateLevelAndPercentage = async (isPlayer1Winner, winnerUser, player1Level, player2Level) => {
  const currentPercentage = winnerUser.level.percentage;

  if (isPlayer1Winner) { //if player1 won
    //if he won against a player with lower level so add 5-10% to his level
    if (player1Level > player2Level) {
      //if he won against a player with one level behind so add 10% to his level
      if (Math.abs(player1Level - player2Level) === 1) {
        if (currentPercentage < 90) {
          winnerUser.level.percentage += 10;
        }
        else {
          winnerUser.level.percentage += 10;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with two levels behind so add 8% to his level
      else if (Math.abs(player1Level - player2Level) === 2) {
        if (currentPercentage < 92) {
          winnerUser.level.percentage += 8;
        }
        else {
          winnerUser.level.percentage += 8;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with three levels behind so add 6% to his level
      else if (Math.abs(player1Level - player2Level) === 3) {
        if (currentPercentage < 94) {
          winnerUser.level.percentage += 6;
        }
        else {
          winnerUser.level.percentage += 6;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with four levels behind so add 4% to his level
      else if (Math.abs(player1Level - player2Level) === 4) {
        if (currentPercentage < 96) {
          winnerUser.level.percentage += 4;
        }
        else {
          winnerUser.level.percentage += 4;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with five levels behind so add 2% to his level
      else if (Math.abs(player1Level - player2Level) === 5) {
        if (currentPercentage < 98) {
          winnerUser.level.percentage += 2;
        }
        else {
          winnerUser.level.percentage += 2;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
    }

    //if he won against a player with higher level so add 15-30% to his level
    else if (player2Level > player1Level) {
      //if he won against a player with 5 levels ahead so add 30% to his level
      if (Math.abs(player1Level - player2Level) === 5) {
        if (currentPercentage < 70) {
          winnerUser.level.percentage += 30;
        }
        else {
          winnerUser.level.percentage += 30;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with 4 levels ahead so add 25% to his level
      else if (Math.abs(player1Level - player2Level) === 4) {
        if (currentPercentage < 75) {
          winnerUser.level.percentage += 25;
        }
        else {
          winnerUser.level.percentage += 25;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with 3 levels ahead so add 20% to his level
      else if (Math.abs(player1Level - player2Level) === 3) {
        if (currentPercentage < 80) {
          winnerUser.level.percentage += 20;
        }
        else {
          winnerUser.level.percentage += 20;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with 2 levels ahead so add 17% to his level
      else if (Math.abs(player1Level - player2Level) === 2) {
        if (currentPercentage < 83) {
          winnerUser.level.percentage += 17;
        }
        else {
          winnerUser.level.percentage += 17;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with 1 level ahead so add 15% to his level
      else if (Math.abs(player1Level - player2Level) === 1) {
        if (currentPercentage < 85) {
          winnerUser.level.percentage += 15;
        }
        else {
          winnerUser.level.percentage += 15;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
    }

    //if he won against a player with same level so add 12% to his level
    else {
      if (currentPercentage < 88) {
        winnerUser.level.percentage += 12;
      }
      else {
        winnerUser.level.percentage += 12;
        winnerUser.level.percentage = winnerUser.level.percentage % 100;
        winnerUser.level.number += 1;
      }
    }

  }

  else { //if player2 won 
    //if he won against a player with lower level so add 5-10% to his level
    if (player2Level > player1Level) {
      //if he won against a player with one level behind so add 10% to his level
      if (Math.abs(player1Level - player2Level) === 1) {
        if (currentPercentage < 90) {
          winnerUser.level.percentage += 10;
        }
        else {
          winnerUser.level.percentage += 10;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with two levels behind so add 8% to his level
      else if (Math.abs(player1Level - player2Level) === 2) {
        if (currentPercentage < 92) {
          winnerUser.level.percentage += 8;
        }
        else {
          winnerUser.level.percentage += 8;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with three levels behind so add 6% to his level
      else if (Math.abs(player1Level - player2Level) === 3) {
        if (currentPercentage < 94) {
          winnerUser.level.percentage += 6;
        }
        else {
          winnerUser.level.percentage += 6;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with four levels behind so add 4% to his level
      else if (Math.abs(player1Level - player2Level) === 4) {
        if (currentPercentage < 96) {
          winnerUser.level.percentage += 4;
        }
        else {
          winnerUser.level.percentage += 4;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with five levels behind so add 2% to his level
      else if (Math.abs(player1Level - player2Level) === 5) {
        if (currentPercentage < 98) {
          winnerUser.level.percentage += 2;
        }
        else {
          winnerUser.level.percentage += 2;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }      

    }

    //if he won against a player with higher level so add 15-30% to his level
    else if (player2Level > player1Level) {
      //if he won against a player with 5 levels ahead so add 30% to his level
      if (Math.abs(player1Level - player2Level) === 1) {
        if (currentPercentage < 70) {
          winnerUser.level.percentage += 30;
        }
        else {
          winnerUser.level.percentage += 30;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with 4 levels ahead so add 25% to his level
      else if (Math.abs(player1Level - player2Level) === 2) {
        if (currentPercentage < 75) {
          winnerUser.level.percentage += 25;
        }
        else {
          winnerUser.level.percentage += 25;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with 3 levels ahead so add 20% to his level
      else if (Math.abs(player1Level - player2Level) === 3) {
        if (currentPercentage < 80) {
          winnerUser.level.percentage += 20;
        }
        else {
          winnerUser.level.percentage += 20;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with 2 levels ahead so add 17% to his level
      else if (Math.abs(player1Level - player2Level) === 4) {
        if (currentPercentage < 83) {
          winnerUser.level.percentage += 17;
        }
        else {
          winnerUser.level.percentage += 17;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }
      //if he won against a player with 1 level ahead so add 15% to his level
      else if (Math.abs(player1Level - player2Level) === 5) {
        if (currentPercentage < 85) {
          winnerUser.level.percentage += 15;
        }
        else {
          winnerUser.level.percentage += 15;
          winnerUser.level.percentage = winnerUser.level.percentage % 100;
          winnerUser.level.number += 1;
        }
      }      
    }

    //if he won against a player with same level so add 12% to his level
    else {
      if (currentPercentage < 88) {
        winnerUser.level.percentage += 12;
      }
      else {
        winnerUser.level.percentage += 12;
        winnerUser.level.percentage = winnerUser.level.percentage % 100;
        winnerUser.level.number += 1;
      }
    }
  }

  return winnerUser;
}

const updatePlayersStats = async (game) => {
  try {
    const player1 = await UserModel.findOne({ _id: game.player1 });
    const player2 = await UserModel.findOne({ _id: game.player2 });

    const player1Level = player1.level.number;
    const player2Level = player2.level.number;

    const winner = game.winner;
    const winnerUser = await UserModel.findOne({ _id: winner });

    let isPlayer1Winner;
    if (winnerUser.username == player1.username) {
      isPlayer1Winner = true;
    } else {
      isPlayer1Winner = false;
    }

    const winnerUserUpdated = await updateLevelAndPercentage(isPlayer1Winner, winnerUser, player1Level, player2Level);
    if (winnerUserUpdated.level.number > 5) {
      winnerUserUpdated.level.number = 5;
      winnerUserUpdated.level.percentage = 100;
    }
    await UserModel.updateOne({ _id: winner }, { $set: winnerUserUpdated });

  } catch (error) {
    throw new Error(`Failed to update players stats: ${error.message}`);
  }
}

const getAllUsers = async (username) => {
  try {
    const myUser = await getFullUserDetails(username);
    const users = await UserModel.find().lean();
    const friendRequestsSent = await friendRequestModel.find({ fromUser: myUser._id });
    const friendRequestsReceived = await friendRequestModel.find({ toUser: myUser._id });
    const finalUsers = [];
  
    for (const user of users) {
      delete user.password;
  
      const isFriend = myUser.friends.some(friend => friend.username === user.username);
      const hasPendingRequestSent = friendRequestsSent.some(request => request.toUser.equals(user._id));
      const hasPendingRequestReceived = friendRequestsReceived.some(request => request.fromUser.equals(user._id));
      let friendRequestExists = false;
      if (hasPendingRequestReceived || hasPendingRequestSent) {
        friendRequestExists = true;
      }
      delete user.friends;
      delete user.__v;
      user.profilePic = await storageService.getProfilePicUrl(user.profilePic);
      if (user.username !== username && !isFriend && !friendRequestExists) {
        finalUsers.push({ ...user, requestExist: "false" });
      } else if (friendRequestExists || isFriend) {
        finalUsers.push({ ...user, requestExist: "true" });
      }
    }
  
    return finalUsers;
  } catch (error) {
    console.error("Error while processing users:", error);
    // Handle the error appropriately
  }
}


const isUsernameExist = async (username) => {
  const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return { error: 'Username is already taken', status: 409 };
      }
      else{
        return {status:200};
      }
}


const getUserFavorites = async (username) => {
  const user = await UserModel.findOne({ username });
  //get user game history
  const games = await gameService.getGames(username);
  //see the other users out user played with the most
  const users = new Map();
  for (const game of games){
    if (game.player1.username === username){
      if (users.has(game.player2.username)){
        users.set(game.player2.username, users.get(game.player2.username)+1);
      }
      else{
        users.set(game.player2.username, 1);
      }
    }
  }
  //sort the map by value
  const sortedUsers = new Map([...users.entries()].sort((a, b) => b[1] - a[1]));
  //get the top 3 users
  const top3Users = [];
  let i = 0;
  for (const user of sortedUsers){
    if (i === 3){
      break;
    }
    top3Users.push(user[0]);
    i++;
  }

  //get the top 3 users details
  const top3UsersDetails = [];
  for (const user of top3Users){
    const userDetails = await getFullUserDetails(user);
    top3UsersDetails.push(userDetails);
  }
  return top3UsersDetails;
}
const updateUserProfilePic = async (profilePic,username)=>{
  try{
  await storageService.uploadProfilePic(profilePic);
  const user = await UserModel.findOne({username:username});
  user.profilePic = profilePic.originalname;
  await user.save();
  return await storageService.getProfilePicUrl(profilePic.originalname);
  }catch(error){
    throw new Error(error.message);
  }
}
const getUserFriends = async (username) => { 
const userDetails = await getFullUserDetails(username);
const friends = userDetails.friends;
const friendsDetails = [];
for(const friend of friends){
  const friendDetails = await getUserDetails(friend.username);
  const profilePicUrl = await storageService.getProfilePicUrl(friendDetails.profilePic);
  friendDetails.profilePic = profilePicUrl;
  friendsDetails.push(friendDetails);
}
return friendsDetails;
}

const removeExpoPushToken = async (username) => {
  try{
    const emptyToken = " ";
    const userID = await getUserID(username);
    const updatedUser = await UserModel.findByIdAndUpdate(userID, {lastConnectedDevice: emptyToken});
    return { status: 200 };
  }
  catch(error){
    return { error: 'Internal server error', status: 500 };
  }
}

const getUserPodium = async (username) => {
try{
  const user = await UserModel.findOne({'username': username}); 
  const level = user.level.number;
  const users = await UserModel.find({ 'level.number': level }).sort({ 'level.percentage': -1 });
  for (const user of users) {
    const profilePicUrl = await storageService.getProfilePicUrl(user.profilePic);
    user.profilePic = profilePicUrl;
  }
  const myRank = users.findIndex((user) => user.username === username) + 1;
  return {
    podiumList : users,
    myRank: myRank,
    competitorsNumber: users.length
  }
} catch (error) {
  return { error: error.message, status: 500 };
}
}

export default {createUser,getUserFavorites,removeExpoPushToken, isLoginValid,getAllUsers, getUserDetails,getFullUserDetails,deleteUser,getUserID, updateUserInfo, getUserPerfectMatch,isUsernameExist, updatePlayersStats,updateUserProfilePic,getUserFriends,getUserPodium};
