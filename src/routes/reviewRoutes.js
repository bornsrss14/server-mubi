import express from "express";
import * as reviewRoutes from "../controllers/reviewController.js";

const router = express.Router();

//crear o actualizar si existen registros
router.post("/", reviewRoutes.createOrUpdateReview);
//obtener todas por usuario
router.get("/:id_user", reviewRoutes.getAllByIdUser);
router.delete("/", reviewRoutes.deleteByUserAndTmdbId);

export default router;
