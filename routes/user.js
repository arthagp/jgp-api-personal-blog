const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

router.get("/user", authentication, UserController.findUsersById);
router.get("/users", authentication, UserController.findUsers);
router.post("/login", UserController.login);
router.post("/register", UserController.register);

module.exports = router;
