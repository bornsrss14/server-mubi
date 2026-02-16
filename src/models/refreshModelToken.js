import db from "../config/database.js";

class RefreshToken {
  static async create(id_user, token, expiresInDays = 7, deviceInfo = null) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    const sql =
      "INSERT INTO refresh_tokens (id_user, token, expires_at, device_info) VALUES (?,?,?,?)";
    const [result] = await db.query(sql, [
      id_user,
      token,
      expiresAt,
      deviceInfo,
    ]);
    return result.insertId;
  }
  //buscar un token válido
  static async findByToken(token) {
    const sql = `SELECT rt.*, u.username, u.roles 
    FROM refresh_tokens rt JOIN User u on rt.user_id = u.id 
    WHERE rt.token = ? AND rt.expires_at > NOW()`;
    const [rows] = await db.query(sql, [token]);
    return rows[0];
  }
  //pretendo eliminar un token en especifico, para hacer logout de un dispositivo
  static async deleteByToken(token) {
    const sql = `DELETE from refresh_tokens WHERE token = ?`;
    await db.query(sql, [token]);
  }
  // Eliminar todos los tokens de un usuario (logout de todos los dispositivos)
  static async deleteAllByUserId(id_user) {
    const sql = `DELETE FROM refresh_tokens WHERE user_id = ?`;
    await db.query(sql, [id_user]);
  }
  // Limpiar tokens expirados (ejecutar periódicamente)
  static async deleteExpired() {
    const sql = "DELETE FROM refresh_tokens WHERE expires_at < NOW()";
    await db.query(sql);
  }
  // Obtener todas las sesiones activas de un usuario
  static async getActiveSessions(id_user) {
    const sql = `SELECT id, device_info, created_at, expires_at 
       FROM refresh_tokens 
       WHERE user_id = ? AND expires_at > NOW()
       ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, [id_user]);
    return rows;
  }
  static async limitSessions(id_user, maxSessions = 5) {
    const sql = `SELECT id FROM refresh_tokens 
       WHERE user_id = ? AND expires_at > NOW()
       ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, [id_user]);
    if (rows.length >= maxSessions) {
      //voy a eliminar las sesiones más antiguas
      const idsToDelete = rows.slice(maxSessions - 1).map((r) => r.id);
      await db.query("DELETE FROM refresh_tokens WHERE id IN (?)", [
        idsToDelete,
      ]);
    }
  }
}

export default RefreshToken;
