// models/user.model.js

import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash", // DB column
    },
    // FK: Role
    roleId: {
      type: DataTypes.UUID,
      allowNull: true, // allow null until migration is complete
      field: "role_id",
      references: {
        model: "role",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    // FK: Department
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "department_id",
      references: {
        model: "department",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      allowNull: false,
      defaultValue: "active",
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_login_at",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
    avatarUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "avatar_url",
    },
  },
  {
    tableName: "users",
    timestamps: false, // We're manually mapping createdAt & updatedAt
    underscored: true, // Future-proof if you later enable timestamps
  }
);

export default User;
