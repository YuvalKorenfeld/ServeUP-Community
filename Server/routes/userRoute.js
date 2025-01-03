import { createUser,getUserDetails,removeExpoPushToken,deleteUser,getUserFavorites, updateUserInfo, getOtherUserDetails, getUserPerfectMatch, getAllUsers, isUsernameExist,updateUserProfilePic,getUserFriends } from '../controllers/userController.js';
import express from 'express';
import upload from '../middlewares/multer.js';
const router = express.Router();

router.post('/', createUser);
router.get('/friends',getUserFriends)
router.get('/:username',getUserDetails)
router.delete('/', deleteUser);
router.patch('/ProfilePic',upload.single('image'),updateUserProfilePic);
router.patch('/', updateUserInfo); 
router.get('/other/:username',getOtherUserDetails)
router.post('/:username/match',getUserPerfectMatch)
router.get('/:username/all',getAllUsers)
router.get('/:username/exist',isUsernameExist)
router.get('/:username/favorites', getUserFavorites)
router.post('/:username/logout', removeExpoPushToken)

export default router;
