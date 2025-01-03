import UserModel from '../models/userModel.js';
import userService from './userService.js'
import jwt from 'jsonwebtoken';

async function getToken(username, password, expoPushToken) {
    try {
      if (await userService.isLoginValid(username, password)) {
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //find user id by username and update token field
        const userID = await userService.getUserID(username);
        const updatedUser = await UserModel.findByIdAndUpdate(userID, {lastConnectedDevice: expoPushToken});
        return { token, status: 200 };
      }
      return { error: 'Invalid username and/or password', status: 404 };
    } catch (error) {
      return { error: 'Internal server error', status: 500 };
    }
  }
  async function isLoggedIn(tokenHeader) {
    const extractedTokenString = tokenHeader.split(" ")[1]
  
    try {
     
      const username = jwt.verify(extractedTokenString, process.env.JWT_SECRET);
      return username.username;
    } catch (error) {
      if(error.name==='TokenExpiredError'){
        throw {error:'Token expired',status:401};
      }
      throw {error:'Invalid token',status:401}
    }
  }
  
  export default { getToken, isLoggedIn };
  