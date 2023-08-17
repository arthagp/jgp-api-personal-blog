const express = require("express");
const router = express.Router();
const PostController = require('../controllers/postController')
const authentication = require("../middlewares/authentication");

router.get('/all-post', authentication, PostController.getAllPost)
router.post('/new-post', authentication, PostController.createPost)
router.put('/edit-post/:postId', authentication, PostController.editPost)
router.delete('/delete-post/:postId', authentication, PostController.destroyPost)

module.exports = router