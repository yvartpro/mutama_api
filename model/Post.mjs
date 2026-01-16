import { DataTypes } from "sequelize"


export default (sequelize) => {
  const Post = sequelize.define("Post",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT },
      images: { type: DataTypes.JSON, allowNull: true },
      appartmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    },
    { tableName: "mutama_posts", timestamps: true, paranoid: true }
  )
  return Post
}