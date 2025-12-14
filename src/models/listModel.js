import db from "../config/database.js";

/*Por esta parte la capa de persistencia es la encargada de comunicarse 
con la base de datos, crear las instrucciones SQL, para las operaciones de 
update, delete, create, read y retornarlas en un formato independiente 
a la base de datos */

class List {
  /*Obtener todas las listas de X usuario*/

  static async getListById(id_list) {
    const [rows] = await db.query("SELECT * FROM lists WHERE id = ?", [
      id_list,
    ]);
    return rows;
  }
  static async getAllLists(id_user) {
    const [rows] = await db.query("SELECT * FROM lists WHERE id_user = ?", [
      id_user,
    ]);
    return rows;
  }

  static async getEntries(listIds) {
    if (listIds.length === 0) return [];

    const [entries] = await db.query(
      `SELECT id, id_item_list, id_mubi_tmdb, note, rating, position FROM list_entries WHERE id_item_list IN (?)`,
      [listIds]
    );
    return entries;
  }
  static async addList(listData) {
    const { id_user, title, is_public, brief_description } = listData;
    const [result] = await db.query(
      "INSERT INTO lists (id_user, title, is_public, brief_description) VALUES (?,?,?,?)",
      [id_user, title, is_public, brief_description]
    );

    return result.insertId;
  }

  static async updateList(id, listData) {
    const { title, is_public, brief_description } = listData;
    const [result] = await db.query(
      "UPDATE lists SET title = ?, is_public = ?, brief_description = ? WHERE id = ?",
      [title, is_public, brief_description, id]
    );
    return result.affectedRows;
  }

  static async deleteList(id) {
    const [result] = await db.query("DELETE from lists WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

export const createListWithEntries = async (listData) => {
  const conn = await db.getConnection();
  const {
    id_user,
    title,
    brief_description = null,
    is_public = 1,
    entries = [],
  } = listData;
  try {
    await conn.beginTransaction();
    // 1. Create list > without a list it's imposible to create a list_entrie relation
    const [result] = await conn.query(
      "INSERT INTO lists (id_user, title, brief_description, is_public) VALUES (?,?,?,?)",
      [id_user, title, brief_description, is_public]
    );
    const listId = result.insertId;

    // Validar si no hay entries, entonces solo regreso la lista
    if (!entries || entries.length === 0) {
      await conn.commit();
      return { listId };
    }
    //2. insertar las entries
    const values = entries.map((e) => [
      listId,
      e.id_mubi_tmdb,
      e.note ?? null,
      e.rating ?? null,
      e.position ?? 0,
    ]);
    await conn.query(
      "INSERT INTO list_entries (id_item_list, id_mubi_tmdb, note, rating, position ) VALUES ?",
      [values]
    );
    await conn.commit();
    return listId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export default List;
