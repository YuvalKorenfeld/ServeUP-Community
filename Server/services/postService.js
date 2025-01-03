import postModel from '../models/postModel.js';
import UserModel from '../models/userModel.js';
import tokenService from './tokenService.js';
import storageService from './storageService.js';
const createPost = async (postData) => {
    try {
      const newPost= new postModel({
        date: postData.date,
        player: postData.player,
        location: {
            name: postData.location.name,
            adminCode: postData.location.adminCode,
        }
      });
      const savedPost = await newPost.save();
      const objectId = savedPost._id;
      return { status: 201, body: { id: objectId } };
    } catch (error) {
      return { error: error.message, status: 500 };
    }
    
};

async function getAllPosts() {
    try {
        const posts = await postModel.find();
        const output = [];
        for (const post of posts) {
            const postObject = {
                id: post._id.toString(),
                date: post.date,
                location: {
                    name: post.location.name,
                    adminCode: post.location.adminCode,
                },
            };
            try {
                // Fetch player details directly from the post.player field
                const playerDetails = await UserModel.findById(post.player._id);
                postObject.player = {
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
            output.push(postObject);
        }
        return output;
    } catch (error) {
        // Throw the error instead of using res.status (as res is not defined here)
        throw error;
    }
}

async function getPosts(username) {
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }
        const posts = await postModel.find({ 'player': { $ne: user._id } });
        const output = [];
        for (const post of posts) {
            const postObject = {
                id: post._id.toString(),
                date: post.date,
                location: {
                    name: post.location.name,
                    adminCode: post.location.adminCode,
                },
            };
            try {
                // Fetch player details directly from the post.player field
                const playerDetails = await UserModel.findById(post.player._id);
                postObject.player = {
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
            output.push(postObject);
        }
        return output;
    } catch (error) {
        // Throw the error instead of using res.status (as res is not defined here)
        throw error;
    }
}

async function deletePostById(postID){
    try{
      const deleteStatus = await postModel.findByIdAndDelete(postID);
      if(!deleteStatus){
        throw new error("no such post");
      }
      return {status:204};
    }
    catch(error){
      throw error; // Rethrow the error to be caught in the outer try-catch block
    }
}

async function getMyPosts(username){
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }
        const posts = await postModel.find({ 'player': user._id });
        const output = [];
        for (const post of posts) {
            const postObject = {
                id: post._id.toString(),
                date: post.date,
                location: {
                    name: post.location.name,
                    adminCode: post.location.adminCode,
                },
            };
            try {
                // Fetch player details directly from the post.player field
                const playerDetails = await UserModel.findById(post.player._id);
                postObject.player = {
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
            output.push(postObject);
        }
        return output;
    } catch (error) {
        // Throw the error instead of using res.status (as res is not defined here)
        throw error;
    }
}

export default {createPost,getPosts,deletePostById, getAllPosts, getMyPosts};