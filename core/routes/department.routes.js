// routes/department.routes.js
import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
} from "../controllers/department.controller.js";

const departmentRouter = express.Router();

departmentRouter.post("/", createDepartment); // POST /api/departments
departmentRouter.get("/", getDepartments); // GET  /api/departments
departmentRouter.get("/:id", getDepartmentById); // GET  /api/departments/:id

export default departmentRouter;
