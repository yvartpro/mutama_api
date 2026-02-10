import { DataTypes } from "sequelize"

export default (sequelize) => {
  const User = sequelize.define("User",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      full_name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    { tableName: "severinhouse_users", timestamps: true, paranoid: true }
  )
  return User
}
