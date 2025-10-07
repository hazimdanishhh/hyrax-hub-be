// controllers/department.controller.js

import Department from "../models/department.model.js";

// Create Department
export const createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: "Name and code are required." });
    }

    const department = await Department.create({ name, code, description });
    return res
      .status(201)
      .json({ message: "Department created successfully", department });
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    return res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    return res.status(200).json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
