const { Posts, Tags, sequelize, Comments , User} = require("../models");
const { Op } = require("sequelize");

class PostController {
  static async getAllPost(req, res) {
    try {
      const { title } = req.query;
      const where = {};
  
      const limit = +req.query.limit || 10;
      const page = +req.query.page || 1;
      const offset = (page - 1) * limit;
  
      if (title) {
        where.title = { [Op.iLike]: `%${title}%` };
      }
  
      const { count, rows } = await Posts.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Tags,
          },
          {
            model: Comments,
          },
          {
            model: User, 
            attributes: ['username'], 
          },
        ],
      });

      const postsWithUsername = rows.map((post) => {
        const { username } = post.User; 
        return {
          ...post.dataValues,
          username,
        };
      });
  
      res.status(200).json({
        totalItems: count,
        data: postsWithUsername,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getPostById(req, res) {
    try {
      const {postId} = req.params
      const response = await Posts.findByPk(postId, {
        include: [
          {
            model: Tags,
          },{
            model: Comments,
            include: {
              model: User, // untuk mengetahui username yang comment
              attributes: ["username"],
            },
          }
        ]
      })
      if (!response) {
        res.status(404).json({message: 'Post Not Found'})
      } else {
        res.status(200).json({message: 'Found', data: response})
      }
    } catch (error) {
      console.log(error)
    }
  }
  

  static async createPost(req, res) {
    let t = await sequelize.transaction();
    try {
      const { id } = req.userLogged;
      const { title, description, tagsId } = req.body;

      const tagsInstance = await Tags.findAll({
        where: { id: tagsId },
        transaction: t,
      });

      if (!tagsInstance || tagsInstance.length === 0) {
        await t.rollback();
        res.status(400).json({ message: "Tags Not Found" });
      }

      const response = await Posts.create(
        {
          // lihat di model ada berapa attribute sesuaikan dengan itu
          user_id: id,
          title,
          description,
        },
        { transaction: t }
      );

      await response.setTags(tagsInstance, { transaction: t });
      await t.commit();

      res.status(201).json({
        message: "Post Created",
        data: response,
        tags: tagsInstance.map((instance) => ({
          nameTags: instance.name,
        })),
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the post." });
      await t.rollback();
    }
  }

  static async editPost(req, res) {
    let t = await sequelize.transaction();
    try {
      const { id } = req.userLogged;
      const { postId } = req.params;
      const { title, description, tagsId } = req.body;

      if (!postId) {
        await t.rollback();
        return res.status(400).json({ message: "postId is required" });
      }

      const findOne = await Posts.findOne({
        where: { id: postId, user_id: id },
        transaction: t,
      });

      if (!findOne) {
        await t.rollback();
        return res.status(400).json({ message: "Post Not Found" });
      } else {
        const response = await Posts.update(
          { title, description },
          { where: { id: postId, user_id: id }, transaction: t }
        );

        if (tagsId) {
          const tagsInstance = await Tags.findAll({
            where: { id: tagsId },
            transaction: t,
          });

          if (!tagsInstance || tagsInstance.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: "Tags Not Found" });
          }

          await findOne.setTags(tagsInstance, { transaction: t });
        }

        await t.commit();
        const data = await Posts.findByPk(postId);
        return res
          .status(200)
          .json({ message: "Post Updated", dataUpdated: data });
      }
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res
        .status(500)
        .json({ message: "An error occurred while editing the post." });
    }
  }
  static async destroyPost(req, res) {
    try {
      const { postId } = req.params;
      const response = await Posts.destroy({
        where: { id: postId },
      });

      if (!response) {
        res.status(400).json({ message: "Post Id Not Found" });
      }

      res.status(200).json({ message: "Deleted Success", response });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PostController;
