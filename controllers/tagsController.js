const { Tags } = require("../models");

class TagsController {
  static async allTags(req, res) {
    try {
      const response = await Tags.findAll({ order: [["id", "ASC"]] });

      if (!response) {
        res.status(400).json({ message: "Tags Not Found" });
      }
      res.status(200).json({ message: "Tags Found", response });
    } catch (error) {
      console.log(error);
    }
  }

  static async createTags(req, res) {
    try {
      const { name } = req.body;

      const response = await Tags.create({ name });
      res.status(201).json({ message: "Tags Created", data: response });
    } catch (error) {
      console.log(error);
    }
  }

  static async editTags(req, res) {
    try {
      const { tagsId } = req.params;
      const { name } = req.body;

      const response = await Tags.update({ name }, { where: { id: tagsId } });
      if (!response) {
        res.status(400).json({ message: "Tags Not Found" });
      } else {
        const data = await Tags.findByPk(tagsId);
        res.status(201).json({ message: "Succes Edited", data: data });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async destroyTags(req, res) {
    try {
      const { tagsId } = req.params;

      const response = await Tags.destroy({
        where: { id: tagsId },
      });
      if (!response) {
        res.status(400).json({ message: "Tags Not Found" });
      } else {
        res.status(200).json({ message: "Delete Tags Succes" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = TagsController;
