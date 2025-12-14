import { Router } from "express";
import * as userMoviesController from "../controllers/userMoviesController.js";
const router = Router();

/* GET api/users/status*/
router.get("/status/:id_user/:id_tmdb", userMoviesController.getMovieStatus);
router.get("/liked/:id_user", userMoviesController.getLiked);
router.get("/watched/:id_user", userMoviesController.getWatched); //getWatched
router.get("/to_watch/:id_user", userMoviesController.getToWatch); //getToWatch
router.post("/:id_user/:id_tmdb/toggle", userMoviesController.toggleUserMovie);
export default router;
