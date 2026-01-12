import express from "express";
import * as reviewRoutes from "../controllers/reviewController.js";

const router = express.Router();

//crear o actualizar si existen registros
router.post("/", reviewRoutes.createOrUpdateReview);
//obtener todas por usuario
router.get("/:id_user", reviewRoutes.getAllByIdUser);
router.delete("/", reviewRoutes.deleteByUserAndTmdbId);

/*Obtengo las reviews de X_id_tmdb pero con info para paginación*/
router.get("/movie/:id_tmdb", reviewRoutes.getReviewsByMubi);
export default router;
