import postService from '../services/postService.js';
import tokenService from '../services/tokenService.js';

export const createPost = async (req, res) => {

    const postData = {
        date: req.body.date,
        player: req.body.player,
        location: {
            name: req.body.location.name,
            adminCode: req.body.location.adminCode,
        }
    };
    const newPost = await postService.createPost(postData);
    res.status(newPost.status).send(newPost.body);
}

export const getAllPosts = async (req, res) => {
    try {
        const username = await tokenService.isLoggedIn(req.headers.authorization);
        res.json(await postService.getAllPosts());
      } catch (error) {
        res.status(400).send();
      }
}


export const getPosts = async (req, res) => {
    try {
        const username = await tokenService.isLoggedIn(req.headers.authorization);
        res.json(await postService.getPosts(req.params.username));
      } catch (error) {
        res.status(400).send();
      }
};

export async function deletePostById(req,res){
  try {
    const username = await tokenService.isLoggedIn(req.headers.authorization);
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try{
    const deleteStatus =  await postService.deletePostById(req.params.id);
    if(deleteStatus.status==204){
      res.status(204).send();
      return;
    }
  } catch (error) {
    res.status(404).json({ title: 'Not Found'});
    return;
  }
}

export const getMyPosts = async (req, res) => {
  try {
    const username = await tokenService.isLoggedIn(req.headers.authorization);
    res.json(await postService.getMyPosts(username));
  } catch (error) {
    res.status(400).send();
  }
};
