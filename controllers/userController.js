const { User } = require("../models"); //import Users  as ... from '../models/users.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserController {
  static async findUsersById(req, res) {
    try {
      const { id } = req.query;
      const response = await User.findOne({
        where: { id },
      });
      res.status(200).json({ message: "Found it", data: response });
    } catch (error) {
      console.log(error);
    }
  }
  static async findUsers(req, res) {
    try {
      const response = await User.findAll();
      res.status(200).json({ message: "Oke", data: response });
    } catch (error) {
      console.log(error);
    }
  }

  static async getUsernameAndId(req, res) {
    try {
      const response = await User.findAll({attributes: ['id', 'username']});
      res.status(200).json({message: 'Found it', data: response })
    } catch (error) {
      console.log(error)
    }
  }
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const findOneUser = await User.findOne({
        where: { username },
      });
      if (findOneUser) {
        const comparePass = await bcrypt.compare(
          password,
          findOneUser.password
        );
        if (comparePass) {
          const token = jwt.sign(
            {
              id: findOneUser.id,
              username: findOneUser.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
          res
            .status(201)
            .json({ message: "login succes", id: findOneUser.id, username: findOneUser.username, token });
        } else {
          res.status(404).json({ message: "Wrong Password" });
        }
      } else {
        res.status(404).json({ message: "Username Not Found" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async register(req, res) {
    try {
      const { username, password } = req.body;

      const findOneUser = await User.findOne({
        where: { username },
      });

      if (findOneUser) {
        res.status(401).json({
          message: "username sudah ada",
        });
      } else {
        bcrypt.hash(password, 10, async function (err, hash) {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const response = await User.create({
              username,
              password: hash,
            });
            res.status(201).json({
              message: "Creating user succes",
              response,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserController;
