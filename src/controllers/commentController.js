import Comment from "../models/commentModel.js";

export const getRepliesById = async (req, res) => {
  try {
    const { id_comment } = req.params; //parent
    const replies = await Comment.getRepliesByIdComment(id_comment);
    return res.json({
      success: true,
      message: `All replies associated at ${id_comment} id comment parent`,
      data: replies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while trying to get the replies by id_parent_comment",
      error: message.error,
    });
  }
};

export const getCommentsByReview = async (req, res) => {
  try {
    const { id_review } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    if (!Number.isInteger(page) || page < 1) {
      throw new Error("Invalid page number");
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error("Invalit limit number");
    }
    const offset = (page - 1) * limit;

    //resolver 2 promesas, 1 devuelve el set de comment
    // 2.- Devuelve el total de X comments asociados a esa review Xn

    const [comments, total] = await Promise.all([
      Comment.getByIdReview(id_review, limit, offset),
      Comment.countByReview(id_review),
    ]);

    const hasMore = offset + comments.length < total;
    console.log("Backend comments response:", {
      commentsCount: comments.length,
      total, // total de comentarios de esa id_review
      offset, // salto XnC
      hasMore, //true or false
    });
    //  Log ➜
    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while trying to get a review by id_review",
      error: error.message,
    });
  }
};

export const getSingleComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.getByOwnId(id);
    res.json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Something went wron while trying to retriev the comment with it's own id",
      error: message.error,
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const allComments = await Comment.getAllComments();
    res.json({ success: true, data: allComments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching allComments :(",
      error: error.message,
    });
  }
};

export const createNew = async (req, res) => {
  const { id_review, id_user, comment_txt, id_parent } = req.body || {};
  //verifico si el usuario existe
  if (!id_user) {
    return res.status(400).json({
      success: false,
      message: "id_user is requiered",
    });
  }
  if (!id_review) {
    return res.status(400).json({
      success: false,
      message: "id_review is required",
    });
  }
  try {
    const newComment = await Comment.create({
      id_review,
      id_user,
      comment_txt,
      id_parent,
    });
    return res.status(201).json({
      success: true,
      message: "Comment added successfully 📨",
      data: newComment,
    });
  } catch (error) {
    console.log(
      "something went wrong, trying to add your comment, please try later",
      error,
    );
    return res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

export const deleteById = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Estos campos son requieridos",
    });
  }
  try {
    //voy a buscar si existe el id del comentario
    const comment = await Comment.getByOwnId(id);
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "No existen coincidencias para eliminar",
      });
    }
    await Comment.deleteById(id);
    return res.json({
      success: true,
      message: "The comment with the id was deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, server error (×_×) ",
    });
  }
};
