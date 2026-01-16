import { DataTypes } from "sequelize"


export default (sequelize) => {
  const Appartment = sequelize.define("Appartment",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      images: { type: DataTypes.JSON, allowNull: true }
    },
    { tableName: "mutama_appartments", timestamps: true, paranoid: true }
  )
  return Appartment
}