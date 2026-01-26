//falta
import db from "../config/database.js";

class Comment {
  /*
  obtener todos los comentarios de X id_review de X review
  resultado esperado:
  [
  {
    comment_id: 12,
    id_review: 808,
    id_user: 4,
    comment_txt: "Buenísima película",
    id_parent: null,
    created_at: "...",
    updated_at: "...",
    user_id: 4,
    username: "ross",
    profile_pic_url: "https/url...",
    given_name: "Rosario",
    family_name: "Fuentes"
  }
]

  */
  static async getByIdReview(id_review, limit, offset) {
    const sql = `
SELECT
  rc.id,
  rc.id_review,
  rc.id_user,
  rc.comment_txt,
  rc.id_parent,
  rc.created_at,
  rc.updated_at,
  u.id AS user_id,
  u.username,
  u.profile_pic_url,
  u.given_name,
  u.family_name,
  (
        SELECT COUNT(*) 
        FROM review_comments rc 
        WHERE rc.id_parent = ch.id_parent
      ) as replies_count
FROM review_comments rc
LEFT JOIN User u 
  ON rc.id_user = u.id
LEFT JOIN review_comments ch 
  ON ch.id_parent = rc.id
WHERE rc.id_review = ?
  AND rc.id_parent IS NULL
GROUP BY rc.id
ORDER BY rc.created_at DESC
LIMIT ? OFFSET ?;
`;
    const [rows] = await db.query(sql, [id_review, limit, offset]);
    return rows;
  }

  /*calculate total record count and return all record PARENT record, with pagination mode*/
  static async countByReview(id_review) {
    const sql = `SELECT COUNT(*) as total FROM review_comments 
    WHERE id_review = ? AND id_parent = NULL`;
    const [rows] = await db.query(sql, [id_review]);
    return rows[0].total;
  }

  //search by its id
  static async getByOwnId(id) {
    const sql = `SELECT * FROM review_comments WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }
  //all the existing comment record
  static async getAllComments() {
    const [rows] = await db.query(
      "SELECT * from review_comments ORDER BY id DESC",
    );
    return rows;
  }

  //crear un comentario necesito: [id_review, id_user, comment_txt, id_parent]
  static async create(commentData) {
    const { id_review, id_user, comment_txt, id_parent } = commentData;

    const sql = `INSERT INTO review_comments (id_review, id_user, comment_txt, id_parent, created_at) VALUES (?,?,?,?, NOW()) `;
    const values = [
      id_review,
      id_user,
      comment_txt,
      id_parent !== undefined && id_parent !== null ? id_parent : null,
    ];
    const [result] = await db.query(sql, values);
    return result.insertId;
  }

  static async deleteById(id) {
    const sql = `DELETE FROM review_comments WHERE id = ? `;
    const [rows] = await db.query(sql, [id]);
    return rows.affectedRows;
  }

  static async update(id, commentData) {
    const { id_review, id_user, comment_txt, id_parent } = commentData;
    const sql = `UPDATE review_comments SET id_review = ?, id_user = ?, comment_txt = ?, id_parent = ? WHERE id = ?`;
    const values = [
      id_review,
      id_user,
      comment_txt,
      id_parent !== undefined && id_parent !== null ? id_parent : null,
      id,
    ];
    const [rows] = await db.query(sql, values);
    return [rows].affectedRows;
  }

  //replies
  //getRepliesByIdComment, in this case i'll use pagination
  /*It's like saying, Hey! give me all the replies from this specific parent comment */
  static async getRepliesByIdComment(id_comment) {
    const sql = `
   SELECT
    rch.id AS comment_id,
    rch.id_review,
    rch.created_at,
    rch.id_user,
    rch.id_parent,  
    rch.comment_txt,
    usr.id AS user_id,
    usr.username,
    usr.given_name,
    usr.family_name,
    usr.profile_pic_url
FROM review_comments rch
LEFT JOIN User usr
    ON rch.id_user = usr.id
WHERE rch.id_parent = ?
ORDER BY rch.created_at ASC`;
    const values = [id_comment];
    const [rows] = await db.query(sql, values);
    return rows;
  }
}

export default Comment;
