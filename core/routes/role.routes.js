// routes/role.routes.js
import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,
} from "../controllers/role.controller.js";

const roleRouter = express.Router();

roleRouter.post("/", createRole); // POST /api/roles
roleRouter.get("/", getRoles); // GET  /api/roles
roleRouter.get("/:id", getRoleById); // GET  /api/roles/:id

export default roleRouter;
