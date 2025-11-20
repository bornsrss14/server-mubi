import db from "../config/database.js";

/*Por esta parte la capa de persistencia es la encargada de comunicarse 
con la base de datos, crear las instrucciones SQL, para las operaciones de 
update, delete, create, read y retornarlas en un formato independiente 
a la base de datos */

class List {
  /*Obtener todas las listas */
  static async getAllLists() {
    const [rows] = await db.query("SELECT * FROM List ORDER by id DESC");
    return rows;
  }

  static async getListById(id) {
    const [rows] = await db.query("SELECT * FROM List WHERE id = ?", [id]);
    return rows[0];
  }

  static async addList(listData) {
    const { title, description_gral, is_public, user_id } = listData;
    const [result] = await db.query(
      "INSERT INTO List (title, description_gral, is_public, user_id) VALUES (?,?,?,?)",
      [title, description_gral, is_public, user_id]
    );

    return result.insertId;
  }

  static async updateList(id, listData) {
    const { title, description_gral, is_public, user_id } = listData;
    const [result] = await db.query(
      "UPDATE List SET title = ?, description_gral = ?, is_public = ?, user_id",
      [title, description_gral, is_public, user_id]
    );
    return result.affectedRows;
  }

  static async deleteList(id) {
    const [result] = db.query("DELETE  from List WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

export default List;
