import express from "express";
import * as userController from "../controllers/userControllers.js";
const router = express.Router();

/*GET /api/users - Get all users */
router.get("/", userController.getAllUsers);
/*GET /api/users/:id */
router.get("/:id", userController.getUserById);
/*POST - /api/usuarios - Crear nuevo Usuario */
router.post("/", userController.addNewUser);
/*PUT- Actualizar Usuario */
router.put("/:id", userController.updateUser);
/* DELETE user*/
router.delete("/:id", userController.deleteUser);

export default router;
