//falta
import db from "../config/database.js";

class Comment {
  //obtener todos los comentarios de X id_review de X review
  static async getByIdReview(id_review) {
    const sql = `SELECT * FROM review_comments WHERE id_review = ? `;
    const [rows] = await db.query(sql, [id_review]);
    return rows;
  }
  //por el propio id
  static async getByOwnId(id) {
    const sql = `SELECT * FROM review_comments WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }
  //todos los registros existentes de comentarios sin distinción
  static async getAllComments() {
    const [rows] = await db.query(
      "SELECT * from review_comments ORDER BY id DESC"
    );
    return rows;
  }

  //crear un comentario necesito: [id_review, id_user, comment_txt, id_parent]
  static async create(commentData) {
    const { id_review, id_user, comment_txt, id_parent } = commentData;

    const sql = `INSERT INTO review_comments (id_review, id_user, comment_txt, id_parent, created_at) VALUES (?,?,?,?, NOW()) `;
    const values = [
      id_review,
      id_user,
      comment_txt,
      id_parent !== undefined && id_parent !== null ? id_parent : null,
    ];
    const [result] = await db.query(sql, values);
    return result.insertId;
  }

  static async deleteById(id) {
    const sql = `DELETE FROM review_comments WHERE id = ? `;
    const [rows] = await db.query(sql, [id]);
    return rows.affectedRows;
  }

  static async update(id, commentData) {
    const { id_review, id_user, comment_txt, id_parent } = commentData;
    const sql = `UPDATE review_comments SET id_review = ?, id_user = ?, comment_txt = ?, id_parent = ? WHERE id = ?`;
    const values = [
      id_review,
      id_user,
      comment_txt,
      id_parent !== undefined && id_parent !== null ? id_parent : null,
      id,
    ];
    const [rows] = await db.query(sql, values);
    return [rows].affectedRows;
  }
}

export default Comment;
