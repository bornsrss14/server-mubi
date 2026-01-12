import db from "../config/database.js";

class Rating {
  static async createNew(dataRating) {
    const { id_user, id_tmdb, rating } = dataRating;
    const sql = `INSERT INTO ratings (id_user, id_tmdb, rating) VALUES(?,?,?)`;
    const [result] = await db.query(sql, [id_user, id_tmdb, rating]);
    return {
      id: result.insertId,
      id_user,
      id_tmdb,
      rating,
    };
    /*segun mi modelo: return {id: result.insertId, ...dataRating} */
  }

  static async updateById(id, rating) {
    const sql = `UPDATE ratings SET rating = ? , updated_at = NOW() WHERE id = ?`;
    const [result] = await db.query(sql, [rating, id]);
    return result.affectedRows > 0;
  }

  static async deleteByUserAndMovieId(id_user, id_tmdb) {
    const sql = `DELETE FROM ratings WHERE id_user = ? AND id_tmdb = ?`;
    const [result] = await db.query(sql, [id_user, id_tmdb]);
    return result.affectedRows > 0;
  }
  static async deleteById(id) {
    const sql = `DELETE FROM ratings WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows;
  }

  static async findByUserAndMubi(id_user, id_tmdb) {
    const sql = `SELECT * FROM ratings WHERE id_user = ? AND id_tmdb = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id_user, id_tmdb]);
    return rows[0] || null;
  }

  static async getByIdUser(id_user) {
    const sql = `SELECT * FROM ratings WHERE id_user = ?`;
    const [rows] = await db.query(sql, [id_user]);
    return rows;
  }

  static async getByOwnId(id, id_user) {
    const sql = `SELECT * FROM ratings WHERE id = ? AND id_user = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id, id_user]);
    return rows;
  }
}
export default Rating;
