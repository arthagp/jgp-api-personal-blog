const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

router.get("/user", UserController.findUsersById);
router.get("/users", UserController.findUsers);
router.get("/user-and-id", UserController.getUsernameAndId);
router.post("/login", UserController.login);
router.post("/register", UserController.register);

module.exports = router;
