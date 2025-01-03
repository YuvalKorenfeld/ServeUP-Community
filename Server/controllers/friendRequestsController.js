import friendsRequestsService from '../services/friendRequestsService.js';
import tokenService from '../services/tokenService.js';

export const createFriendRequest = async (req, res) => {
    const friendRequestData = {
        fromUser: req.body.fromUser,
        toUser: req.body.toUser,
        createdAt: req.body.createdAt,
    };
    const newFriendRequest = await friendsRequestsService.createFriendRequest(friendRequestData);
    res.status(newFriendRequest.status).send(newFriendRequest.body);
}

export const getSentFriendRequests = async (req, res) => {
    try {
        const username = await tokenService.isLoggedIn(req.headers.authorization);
        res.json(await friendsRequestsService.getSentFriendRequests(username));
      } catch (error) {
        res.status(400).send();
      }
}

export const getMyFriendRequests = async (req, res) => {
    try {
        const username = await tokenService.isLoggedIn(req.headers.authorization);
        res.json(await friendsRequestsService.getMyFriendRequests(username));
      } catch (error) {
        res.status(400).send();
      }
}

export const deleteFriendRequest = async (req, res) => {
    try {
        const username = await tokenService.isLoggedIn(req.headers.authorization);
        const friendRequest = await friendsRequestsService.deleteFriendRequest(req.body.fromUser, req.body.toUser);
        res.status(friendRequest.status).send(friendRequest.body);
      } catch (error) {
        res.status(400).send();
      }
}

export const approveFriendRequest = async (req, res) => {
    try {
        const username = await tokenService.isLoggedIn(req.headers.authorization);
        const friendRequest = await friendsRequestsService.approveFriendRequest(req.body.fromUser, req.body.toUser);
        res.status(friendRequest.status).send(friendRequest.body);
      } catch (error) {
        res.status(400).send();
      }
}

