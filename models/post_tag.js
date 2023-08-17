'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Tags, {
        foreignKey: "tag_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.Posts, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Post_tag.init({
    post_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post_tag',
  });
  return Post_tag;
};