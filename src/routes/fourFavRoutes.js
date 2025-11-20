import express from "express";
import * as fourMubiController from "../controllers/fourFavoriteControllers.js";
const router = express.Router();
/*gell all four movies */

router.get("/", fourMubiController.getAllFour);

/*by id */
router.get("/:id", fourMubiController.getFourById); // por id de usuario, no de película
router.post("/", fourMubiController.addFourMubi);

router.delete(
  "/match/:id_mubi/:id_user",
  fourMubiController.deleteByUserAndMubi
); //elimina si hay match

router.delete("/:id", fourMubiController.deleteFourMubi); // por el id del registro, no de película
export default router;
