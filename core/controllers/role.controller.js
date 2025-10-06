// controllers/role.controller.js

import Role from "../models/roles.model.js";

// Create Role
export const createRole = async (req, res) => {
  try {
    const { name, rank, description } = req.body;

    if (!name || !rank) {
      return res.status(400).json({ error: "Name and rank are required." });
    }

    const role = await Role.create({ name, rank, description });
    return res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Role by ID
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
