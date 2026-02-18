import db from "../config/database.js";

/* Por otro lado, la capa de PERSISTENCIA es la encargada de comunicarse a
 la base de datos, crear las instrucciones SQL para consultar, insertar,
  actualizar o borrar registros
 y retornarlos en un formato independiente a la base de datos. */

class User {
  /*1. Obtener todos los usuarios */
  static async getAllUsers() {
    const [rows] = await db.query("SELECT * from User ORDER BY id DESC");
    return rows;
  }

  /*2. Obtener Usuario por ID */
  static async getUserById(id) {
    const [rows] = await db.query("SELECT * FROM User WHERE id = ?", [id]);
    /*
    return rows;
     */
    return rows[0];
  }

  /*3. Crear nuevo usuario */
  static async addUser(userData) {
    const {
      username,
      email,
      password_hash,
      profile_pic_url,
      bio,
      given_name,
      family_name,
      website,
      pronoun,
      location,
      roles,
    } = userData;
    const [result] = await db.query(
      "INSERT INTO User ( username, email, password_hash,profile_pic_url, bio, given_name, family_name, website, pronoun, location,roles) VALUES (?,?,?,?, ?,?,?,?,?, ?,?)",
      [
        username,
        email,
        password_hash,
        profile_pic_url,
        bio,
        given_name,
        family_name,
        website,
        pronoun,
        location,
        roles,
      ],
    );
    return result.insertId;
  }
  /*4. Actualizar Usuario existente (id)) */
  static async updateUser(id, userData) {
    const {
      username,
      email,
      password_hash,
      profile_pic_url,
      bio,
      given_name,
      family_name,
      website,
      pronoun,
      location,
      roles,
    } = userData;
    const [result] = await db.query(
      "UPDATE User SET username= ?, email =?, password_hash =?, profile_pic_url =?, bio =?, given_name =?, family_name =?, website =?, pronoun =?, location=?, roles =? WHERE id = ?",
      [
        username,
        email,
        password_hash,
        profile_pic_url,
        bio,
        given_name,
        family_name,
        website,
        pronoun,
        location,
        roles,
        id,
      ],
    );
    return result.affectedRows;
  }
  /*5. Eliminar Usuario*/

  static async deleteUser(id) {
    const [result] = await db.query("DELETE from User WHERE id = ?", [id]);
    return result.affectedRows;
  }
  /*6. Creo que dejaré algo para busqueda por e-mail, invesitgando es útil para validaciones y evitar duplicidad de cuentas*/
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM User WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }
  // veo necesario implmentar la busqueda de username

  static async findByUsername(username) {
    const [rows] = await db.query("SELECT * FROM User WHERE username = ?", [
      username,
    ]);
    return rows[0];
  }

  static async updateRefreshToken(id_user, refreshToken) {
    const [rows] = await db.query("UPDATE User set");
  }

  static async updateRol(id_user, newRole) {
    const sql = `UPDATE User SET roles = ? where id = ?`;
    await db.query(sql, [newRole, id_user]);
  }
}

export default User;
