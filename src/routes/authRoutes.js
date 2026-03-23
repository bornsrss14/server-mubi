import express from "express";
import * as authController from "../controllers/authController.js";
const router = express.Router();

router.post("/login", authController.authByNicknameAndPwd); // genera el token
router.get("/refresh", authController.handleRefreshToken);
router.post("/logout", authController.logout);
/*    /users  → requiere el token  */
/*El middleware decide si pasa o no, da el acceso */

export default router;
