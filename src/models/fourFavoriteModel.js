import db from "../config/database.js";

/*Esta capa de persistencia, se va a encargar de comunicarse a la
base de datos , crear las instrucciones SQL para consultar, insertar, actualizar
o borrar registros y retornarlos en un formato independiente a la base de datos */

class FavoriteFourMovies {
  static async getFourById(id) {
    // Aquí retorna todos los resultados, no solo 1 conincidente al usuario id
    const [rows] = await db.query(
      "SELECT * FROM  top_favorites_mubis WHERE id_user = ?",
      [id]
    );
    return rows; //cambió
  }
  static async getAllFour() {
    //retorna todos sin distinción de usuario
    const [rows] = await db.query(
      "SELECT * from top_favorites_mubis ORDER by id DESC"
    );
    return rows; //cambió
  }

  static async addFour(fourData) {
    const { id_mubi, id_user } = fourData;
    const [result] = await db.query(
      "INSERT INTO top_favorites_mubis ( id_mubi, id_user) VALUES (?,?) ",
      [id_mubi, id_user]
    );
    return result.insertId;
  }
  static async deleteFourById(id) {
    //lo elimina por id de registro, no de película
    const [result] = await db.query(
      "DELETE FROM top_favorites_mubis WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }

  static async deleteByUserAndMubi(id_mubi, id_user) {
    const [result] = await db.query(
      "DELETE FROM top_favorites_mubis WHERE id_mubi = ? AND id_user = ?",
      [id_mubi, id_user]
    );
    return result.affectedRows;
  }

  static async findByUserAndMovie(id_mubi, id_user) {
    const [rows] = await db.query(
      "SELECT * FROM top_favorites_mubis WHERE id_mubi = ? AND id_user = ?",
      [id_mubi, id_user]
    );
    return rows;
  }

  /*in this table case, it won't be able the mubie update function */
}

export default FavoriteFourMovies;
