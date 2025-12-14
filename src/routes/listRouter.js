/*app.use("/api/user/lists/"); */

import express from "express";
import * as listController from "../controllers/ListsController.js";

const router = express.Router();
//Create list + entries
router.post("/", listController.addList);

//Obtener todos los registros de Lists, no con entries
router.get("/:id_user", listController.getUserLists);

//Obtneer list con entries
router.get("/details/:id_user", listController.getAllUserListsWithEntries);

router.delete("/delete/:id_list", listController.deleteListById);

export default router;
