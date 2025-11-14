import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { delComment,addComment, addNewPost, BookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost, getSinglePost } from "../controllers.js/post.controller.js";

const router=express.Router();

router.route('/addpost').post(isAuthenticated,upload.single('image'),addNewPost);
router.route('/all').get(isAuthenticated,getAllPost);
router.route('/userpost/all').get(isAuthenticated,getUserPost);
router.route('/:id/like').get(isAuthenticated,likePost);
router.route('/:id/dislike').get(isAuthenticated,dislikePost);
router.route('/:id/comment').post(isAuthenticated,addComment);
router.route('/:id/comment/:cid/del').post(isAuthenticated,delComment);
router.route('/:id/comment/all').post(isAuthenticated,getCommentsOfPost);
router.route('/delete/:id').delete(isAuthenticated,deletePost);
router.route('/singelPost/:id').get(isAuthenticated, getSinglePost);
router.route('/:id/bookmark').get(isAuthenticated,BookmarkPost);

export default router;