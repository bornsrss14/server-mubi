import db from "../config/database.js";

// seek if the record exist

class UserMoviesFav {
  static async getLikedMovies(id_user) {
    const [rows] = await db.query(
      `SELECT id_tmdb, created_at from user_movies WHERE id_user = ? AND liked = 1`,
      [id_user]
    );
    return rows;
  }

  static async getWatchedMovies(id_user) {
    const [rows] = await db.query(
      `SELECT id_tmdb, created_at from user_movies WHERE id_user = ? AND watched = 1`,
      [id_user]
    );
    return rows;
  }

  static async getToWatchMovies(id_user) {
    const [rows] = await db.query(
      `SELECT id_tmdb , created_at from user_movies WHERE id_user = ? AND to_watch = 1`,
      [id_user]
    );
    return rows;
  }
  static allowed = ["liked", "watched", "to_watch"];
  static validateField(field) {
    if (!this.allowed.includes(field)) {
      throw new Error("Invalid field");
    }
  }

  //getAll ------------------------------------------------------------------------------------->
  static async getUserMovies(id_user) {
    const [rows] = await db.query(
      `
      SELECT id_tmdb, liked, watched, to_watch, created_at FROM user_movies WHERE id_user = ? 
      `,
      [id_user]
    );

    return rows;
  }
  //crear un registro nuevo en caso de que el estado inicial sea con X campo en TRUE -> 1
  static async addRecord(id_user, id_tmdb, field) {
    this.validateField(field);

    const [result] = await db.query(
      `
    INSERT INTO user_movies (id_user, id_tmdb, liked, watched, to_watch)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE ${field} = 1
    `,
      [
        id_user,
        id_tmdb,
        field === "liked" ? 1 : 0,
        field === "watched" ? 1 : 0,
        field === "to_watch" ? 1 : 0,
      ]
    );

    return result;
  }

  static async deleteStatus(id_user, id_tmdb, field) {
    this.validateField(field);
    await db.query(
      `UPDATE user_movies
       SET ${field} = 0
       WHERE id_user = ? AND id_tmdb = ?`,
      [id_user, id_tmdb]
    );

    const [deleted] = await db.query(
      `
      DELETE FROM user_movies
      WHERE id_user = ?
        AND id_tmdb = ?
        AND liked = 0
        AND watched = 0
        AND to_watch = 0
      `,
      [id_user, id_tmdb]
    );
    return deleted;
  }
  // actualizar un campo
  static async updateField(id_user, id_tmdb, field, value) {
    this.validateField(field);
    const [result] = await db.query(
      `UPDATE user_movies
       SET ${field} = ?
       WHERE id_user = ? AND id_tmdb = ?`,
      [value, id_user, id_tmdb]
    );
    if (result.affectedRows === 0) {
      throw new Error("Record not updated");
    }

    return result;
  }
  static async deleteIfEmpty(id_user, id_tmdb) {
    const [result] = await db.query(
      `DELETE FROM user_movies 
     WHERE id_user = ? AND id_tmdb = ?
       AND liked = 0 AND watched = 0 AND to_watch = 0`,
      [id_user, id_tmdb]
    );
    return result;
  }
  static async findRecord(id_user, id_tmdb) {
    const [rows] = await db.query(
      "SELECT * from user_movies WHERE id_user = ? AND id_tmdb = ?",
      [id_user, id_tmdb]
    );
    return rows[0];
  }
}

export default UserMoviesFav;
