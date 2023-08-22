const { Comments, sequelize, Posts } = require("../models");

class CommentController {
  static async createComment(req, res) {
      try {
        const { id } = req.userLogged;
        const { postId } = req.params;
        const { comment } = req.body;
  
        const postInstance = await Posts.findByPk(postId);
  
        if (!postInstance) {
          return res.status(400).json({ message: "Post Not Found" });
        }
  
        const response = await Comments.create({
          post_id: postId,
          user_id: id,
          comment,
        });
  
        res.status(201).json({
          message: "Comment Created",
          data: response,
          post: { post_id: postInstance.id },
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while creating the comment." });
      }
  }

  static async getAllComments(req, res) {
    try {
      const { postId } = req.params;

      const postInstance = await Posts.findByPk(postId, {
        include: [{ model: Comments, order: [["createdAt", "DESC"]] }],
      });

      if (!postInstance) {
        return res.status(400).json({ message: "Post Not Found" });
      }

      res.status(200).json({
        message: "Comments Retrieved",
        comments: postInstance.Comments,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving comments." });
    }
  }

  static async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { comment } = req.body;

      const commentInstance = await Comments.findByPk(commentId);

      if (!commentInstance) {
        return res.status(400).json({ message: "Comment Not Found" });
      }

      const updatedComment = await commentInstance.update({ comment });

      res.status(200).json({
        message: "Comment Updated",
        data: updatedComment,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the comment." });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { commentId } = req.params;

      const deletedComment = await Comments.destroy({
        where: { id: commentId },
      });

      res.status(200).json({
        message: "Comment Deleted",
        deletedComment,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the comment." });
    }
  }
}

module.exports = CommentController;
