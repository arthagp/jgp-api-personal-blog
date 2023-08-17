'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Tags, {
        through: models.Post_tag,
        foreignKey: "post_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      this.hasMany(models.Comments, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      this.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Posts.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};