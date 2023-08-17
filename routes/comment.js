const express = require("express");
const router = express.Router();
const CommentController = require('../controllers/commentController')
const authentication = require("../middlewares/authentication");

router.post('/new-comment', authentication, CommentController.createComment)
router.get('/comments/:postId', authentication, CommentController.getAllComments)
router.put('/comment/:commentId', authentication, CommentController.updateComment)
router.delete('/comment/:commentId', authentication, CommentController.deleteComment)


module.exports = router