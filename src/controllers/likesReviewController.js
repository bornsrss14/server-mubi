import LikesReviews from "../models/likesReviewModel.js";

export const getCount = async (req, res) => {
  try {
    const { id_review } = req.body;

    if (!id_review) {
      return res.status(400).json({
        succes: false,
        message: "The id_review doesn't exist. Not yet.",
      });
    }
    //1.- validación, buscar si el id_usuario existe
    //2.- Validación buscar si la review existe
    const total = await LikesReviews.getCountByReview(id_review);
    return res.json({
      succes: true,
      cout: total,
    });
  } catch (error) {
    console.error("Something went wrong trying to fetch the total of likes");
    return res.status(500).json({
      succes: false,
      message: "Something went wrong fetching user's likes review (╯°□°）╯ ",
      error: error.message,
    });
  }
};

export const createLike = async (req, res) => {
  try {
    const { id_review, id_user } = req.body;
    if (!id_review || !id_user) {
      res.status(400).json({
        succes: false,
        message: "id_user or id_review are undefined",
      });

      const newLike = await LikesReviews.addLike({ id_review, id_user });

      return res.status(200).json({
        succes: true,
        message: "The like was added succesfully",
        data: newLike,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error", error });
  }
};
