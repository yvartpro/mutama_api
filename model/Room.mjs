import { DataTypes } from "sequelize"


export default (sequelize) => {
  const Room = sequelize.define("Room",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      images: { type: DataTypes.JSON, allowNull: true },
      appartmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    { tableName: "severinhouse_rooms", timestamps: true, paranoid: true }
  )
  return Room
}