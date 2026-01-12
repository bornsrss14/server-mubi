import Comment from "../models/commentModel.js";

export const getCommentsForReview = async (req, res) => {
  try {
    const { id_review } = req.params;
    const comments = await Comment.getByIdReview(id_review);
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while trying to get a review by id_review",
      error: message.error,
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
  const { id_review, id_user, comment_txt, id_parent } = req.body;
  //verifico si el usuario existe
  if (!id_user) {
    return res.status(400).json({
      success: false,
      message: "incomplete data for creating comment",
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
      error
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
