import express from "express";
import * as userController from "../controllers/userControllers.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

/* ---------- RUTAS ESPECÍFICAS  ---------- */

// utilidades
router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// validaciones públicas
router.post("/check-email", userController.byEmail);
router.post("/check-username", userController.byUsername);

// protegida
router.post("/find-username", verifyJWT, userController.findUser);

/* ---------- RUTAS GENERALES ---------- */

// colección
router.get("/", userController.getAllUsers);
router.post("/", userController.addNewUser);

/* ---------- RUTAS DINÁMICAS (SIEMPRE AL FINAL) ---------- */

router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
