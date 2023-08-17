const express = require('express');
const router = express.Router()

const userRouter = require('./user')
const postRouter = require('./post')
const tagsRouter = require('./tags')
const commentRouter = require('./comment')

router.use(userRouter);
router.use(postRouter);
router.use(tagsRouter);
router.use(commentRouter);


module.exports = router