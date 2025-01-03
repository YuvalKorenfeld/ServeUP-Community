import { createFriendRequest, getSentFriendRequests, getMyFriendRequests, deleteFriendRequest, approveFriendRequest } from '../controllers/friendRequestsController.js';
import express from 'express';

const router = express.Router();

router.post('/', createFriendRequest); //createFriendRequest
router.get('/:username/sentFriendRequests', getSentFriendRequests); //to make sure add friend button is disabled
router.get('/:username/myFriendRequests', getMyFriendRequests); //to approve friend requests
router.delete('/decline', deleteFriendRequest); //to delete friend requests
router.delete('/accept', approveFriendRequest); //to delete friend requests
export default router;
