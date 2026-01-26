/*app.use -> "api/user/reviews/comments"*/

import express from "express";
import * as commentController from "../controllers/commentController.js";
const router = express.Router();

//✔️ obtener todos los comentarios existentes, sin distinción
router.get("/details", commentController.getAllComments);
//✔️ crear un nuevo comentario, ya sea con parent o sin parent
router.post("/", commentController.createNew);
//✔️ obtener todos los comentarios de cierta review // 23 by pagination -----this
router.get("/details/:id_review", commentController.getCommentsByReview);
//✔️obtener el comentario por id
router.get("/details/comment/:id", commentController.getSingleComment);
//✔️ eliminar el comentario por su propio id
router.delete("/delete", commentController.deleteById);

//obtener todas las respuestas a un comentario padre por el id_comment (igual son comentarios)
router.get("/details/:id_comment/replies", commentController.getRepliesById); //id_comment means id parent comment

export default router;
