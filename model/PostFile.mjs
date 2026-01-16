import { DataTypes } from "sequelize"


export default (sequelize) => {
  const PostFile = sequelize.define("PostFile",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      postId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      fileId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    { tableName: "mutama_post_files", timestamps: true, paranoid: true }
  )
  return PostFile
}