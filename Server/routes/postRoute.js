import { createPost,getPosts,deletePostById, getAllPosts, getMyPosts } from '../controllers/postController.js';
import express from 'express';

const router = express.Router();

router.post('/', createPost);
router.get('/',getAllPosts)
router.delete("/:id", deletePostById);
router.get('/:username',getPosts);
router.get('/:username/myPosts',getMyPosts);
export default router;
