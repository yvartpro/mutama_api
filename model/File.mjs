import { DataTypes } from "sequelize"


export default (sequelize) => {
  const File = sequelize.define("File",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      url: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.ENUM("image", "video"), defaultValue: "image" },
      description: { type: DataTypes.STRING },
      optimized: { type: DataTypes.BOOLEAN, defaultValue: false },
      alt: { type: DataTypes.STRING },
    },
    { tableName: "mutama_files", timestamps: true, paranoid: true }
  )
  return File
}