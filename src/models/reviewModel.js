import db from "../config/database.js";

class Review {
  //obtener reviews de una película específica

  static async getByMovie(id_tmdb, limit = 4, offset = 0) {
    const sql = `SELECT r.*, u.username, u.profile_pic_url, rt.rating FROM reviews r
    LEFT JOIN User u ON r.id_user = u.id
    LEFT JOIN ratings rt ON r.id_rating = rt.id
    WHERE r.id_tmdb = ? 
    ORDER BY r.created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await db.query(sql, [id_tmdb, limit, offset]);
    return rows;
    /* all the columns of review, USER username, profile_picture, RATINGS rating */
  }
  //calculate total record count and return all record for pagination
  static async countByMovie(id_tmdb) {
    const sql = `SELECT COUNT(*) as total FROM reviews WHERE id_tmdb =?`;
    const [rows] = await db.query(sql, [id_tmdb]);
    return rows[0].total;
  }

  //To show popular reviews in the feed || home section
  static async getTopByMovie() {
    const sql = `SELECT r.*, u.username, u.profile_pic_url, COUNT(l.id) as likes_count 
    FROM reviews r 
    LEFT JOIN User u ON r.id_user = u.id
    LEFT JOIN review_likes l ON r.id = l.id_review
    WHERE r.id_tmdb = ?
    GROUP BY r.id
    ORDER BY likes_count DESC, r.created_at DESC
    LIMIT ?
    `;
    const [rows] = await db.query(sql, [id_tmdb, limit]);
    return rows;
  }

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
