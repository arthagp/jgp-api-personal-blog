const express = require("express");
const router = express.Router();
const TagsController = require('../controllers/tagsController')
const authentication = require("../middlewares/authentication");

router.get('/all-tags', authentication, TagsController.allTags)
router.post('/new-tag', authentication, TagsController.createTags)
router.put('/tag/:tagsId', authentication, TagsController.editTags)
router.delete('/tag/:tagsId', authentication, TagsController.destroyTags)

module.exports = router