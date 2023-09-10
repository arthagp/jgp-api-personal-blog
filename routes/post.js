const express = require("express");
const router = express.Router();
const PostController = require('../controllers/postController')
const authentication = require("../middlewares/authentication");

router.get('/all-post', PostController.getAllPost)
router.get('/detail-post/:postId', PostController.getPostById)
router.post('/new-post', authentication, PostController.createPost)
router.put('/edit-post/:postId', authentication, PostController.editPost)
router.delete('/delete-post/:postId', authentication, PostController.destroyPost)
// get blog by user id
router.get('/my-blog', authentication, PostController.getPostByUserId);

module.exports = router