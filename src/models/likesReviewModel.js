//falta
import db from "../config/database.js";

class LikesReviews {
  static async addLike(likeData) {
    const { id_review, id_user, created_at } = likeData;
    const sql = `INSERT INTO review_likes (id_review, id_user, created_at) VALUES (?,?,NOW())`;
    const values = [id_review, id_user];
    const [result] = await db.query(sql, values);
    return result.insertId;
  }

  /*Obtener el total de likes de X review  */
  static async getCountByReview(id_review) {
    const sql = `SELECT COUNT(*) as total  FROM review_likes WHERE id_review = ?`;
    const [rows] = await db.query(sql, [id_review]);
    return rows[0].total;
  }
}

export default LikesReviews;
