// models/roles.model.js

import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./user.model.js";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.ENUM("admin", "director", "manager", "staff"),
      allowNull: false,
      unique: true,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "roles",
    timestamps: false, // manually managed if needed later
    underscored: true,
  }
);

User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId", as: "user" });

export default Role;
