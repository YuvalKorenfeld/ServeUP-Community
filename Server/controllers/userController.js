import userService from '../services/userService.js';
import tokenService from '../services/tokenService.js';
export const createUser = async (req, res) => {
    const newUser = await userService.createUser(req.body.username,req.body.password,req.body.email,req.body.displayName,req.body.profilePic,req.body.age,req.body.location, req.body.realLevel);
    res.status(newUser.status).send(newUser.body);
    //TODO: maybe return a token here and log the user in automatically
}
export const getUserDetails = async (req, res) => {
  
  try {
    const username = await tokenService.isLoggedIn(req.headers.authorization);
    if(username!==req.params.username){
      res.status(401).send();
      return;
    }
    res.json(await userService.getFullUserDetails(req.params.username));
    return;
  } catch (error) {
    res.status(401).send();
    return;
  }
};
export const deleteUser = async (req, res) => {
  let username=""
  try{
  username = await tokenService.isLoggedIn(req.headers.authorization);
  }catch(error){
    res.status(401).send();
    return;
  }
  const deleteStatus = await userService.deleteUser(username);
  res.status(deleteStatus.status).send();
}

export const updateUserInfo = async (req, res) => {
  let username=""
  try{
  username = await tokenService.isLoggedIn(req.headers.authorization);
  }catch(error){
    res.status(401).send();
    return;
  }
  const updatedUser = await userService.updateUserInfo(username,req.body);
  res.status(200).send(updatedUser);
}

export const getOtherUserDetails = async (req, res) => {
  try {
    //check if their is a user which is logged in
    try{
      const username = await tokenService.isLoggedIn(req.headers.authorization);
    }
    catch(error){
      res.status(401).send();
      return;
    }
    res.json(await userService.getFullUserDetails(req.params.username));
    return;
  } catch (error) {
    res.status(401).send();
    return;
  }
}

export const getUserPerfectMatch = async (req, res) => {
  try {
    //check if their is a user which is logged in
    try{
      const username = await tokenService.isLoggedIn(req.headers.authorization);
    }
    catch(error){
      res.status(401).send();
      return;
    }
    res.json(await userService.getUserPerfectMatch(req.params.username, req.body.date, req.body.location, req.body.currentDate));
    return;
  } catch (error) {
    res.status(401).send();
    return;
  }
}

export const getAllUsers = async (req, res) => {
  try {
    //check if their is a user which is logged in
      const username = await tokenService.isLoggedIn(req.headers.authorization);
      res.send(JSON.stringify(await userService.getAllUsers(username)));
      return;
    }
    catch(error){
      res.status(401).send();
      return;
    }
}

export const isUsernameExist = async (req, res) => {
  try {
    //check if the status field is 200
    const answer = await userService.isUsernameExist(req.params.username);
    if(answer.status!==200){
      res.status(answer.status).send();
      return;
    }
    else{
      res.status(200).send();
      return;
    }
  }
  catch(error){
    res.status(500).send();
    return;
  }
}

export const getUserFavorites = async (req, res) => {
  try {
    try{
      const username = await tokenService.isLoggedIn(req.headers.authorization);
    }
    catch(error){
      res.status(401).send();
      return;
    }
    res.json(await userService.getUserFavorites(req.params.username));
    return;
  } catch (error) {
    res.status(500).send();
    return;
  }
}
export const updateUserProfilePic = async (req, res) => {
  let username=""
try{
  username = await tokenService.isLoggedIn(req.headers.authorization);
  

}catch(error){
  res.status(401).send();
  return;
}
let updatedUserImage="";
  try{
  updatedUserImage = await userService.updateUserProfilePic(req.file,username);
  }catch(error){
    res.status(500).send(error.message);
    return;
  }
  res.status(200).send({profilePic:updatedUserImage});
}
export const getUserFriends = async (req, res) => {
let username=""
try{
  username = await tokenService.isLoggedIn(req.headers.authorization);
}
catch(error){
  res.status(401).send();
  return;
}
  try {
    res.json(await userService.getUserFriends(username));
    return;
  } catch (error) {
    res.status(500).send();
    console.error(error.message)
  }
}

export const removeExpoPushToken = async (req, res) => {
  try {
    const username = await tokenService.isLoggedIn(req.headers.authorization);
    const answer = await userService.removeExpoPushToken(req.params.username);
    if(answer.status!==200){
      res.status(answer.status).send();
      return;
    }
    else{
      res.status(200).send();
      return;
    }
  }
  catch(error){
    res.status(500).send();
    return;
  }
}