import db from "../config/database.js";

class Review {
  static async addReview(reviewData) {
    const { id_user, id_tmdb, id_rating, review, has_spoilers } = reviewData;
    const sql = `INSERT INTO reviews ( id_user, id_tmdb, id_rating, review, has_spoilers, created_at) VALUES (?,?,?,?,?,NOW())`;
    const [result] = await db.query(sql, [
      id_user,
      id_tmdb,
      id_rating,
      review,
      has_spoilers,
    ]);
    return result.insertId;
  }
  /*El id podría ser propio o de id_tmdb  updateSoloReview antes*/
  static async updateByOwnId(id, reviewData) {
    const { id_rating, review, has_spoilers } = reviewData;
    const sql = `UPDATE reviews SET id_rating = ?, review = ?, has_spoilers = ?, updated_at = NOW() WHERE id = ?`;
    const [rows] = await db.query(sql, [id_rating, review, has_spoilers, id]);

    return rows.affectedRows > 0;
  }

  /*El id podría ser solo del propio o combinado */
  static async deleteById(id) {
    const sql = `DELETE FROM reviews WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows.affectedRows;
  }

  //id_ unico de el registro, no de usurio o película
  static async getById(id) {
    const sql = `SELECT * FROM reviews WHERE id = ? `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  }

  static async findByUserAndTmdbId(id_user, id_tmdb) {
    const sql = `SELECT * FROM reviews WHERE id_user = ? AND id_tmdb = ?`;
    const [rows] = await db.query(sql, [id_user, id_tmdb]);
    return rows[0];
  }

  static async getAllByIdUser(id_user) {
    const sql = `SELECT * FROM reviews WHERE id_user = ?`;
    const [results] = await db.query(sql, [id_user]);
    return results;
  }
}

export default Review;
