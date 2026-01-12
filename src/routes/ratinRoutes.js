/*app.use -> "/api/user/ratings" */

import express from "express";
import * as ratingController from "../controllers/ratingsController.js";
const router = express.Router();

router.post("/", ratingController.addOrUpdateRating);
/*ambos casos*/
router.get("/:id_user/:id_tmdb", ratingController.findOneByUserAndMovie);
router.get("/:id_user", ratingController.getAll);
router.get("/:id/:id_user", ratingController.getById);
/*caso individual rating */
router.delete("/:id_user/:id_tmdb", ratingController.deleteRating);

/*individualmente, no directo con review */
router.put("/", ratingController.updateById);

export default router;
