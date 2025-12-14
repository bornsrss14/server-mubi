//importar los modelos de bd

import Rating from "../models/ratingModel.js";
import Review from "../models/reviewModel.js";

export const deleteByUserAndTmdbId = async (req, res) => {
  //eliminar por el id_user , id_tmdb
  try {
    const { id_user, id_tmdb } = req.body;
    const reviewRecord = await Review.findByUserAndTmdbId(id_user, id_tmdb);
    if (!reviewRecord) {
      return res
        .status(404)
        .json({ success: false, message: "any record found" });
    }
    await Review.deleteById(reviewRecord.id);
    return res.json({ success: true, message: "Review record was deleted." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong, try again later",
      error: error.message,
    });
  }
};

export const getAllByIdUser = async (req, res) => {
  //traer por id_user y id_tmbd
  try {
    const { id_user } = req.params;
    if (!id_user) {
      return res.status(400).json({
        success: false,
        message: "the user doesn't exist",
      });
    }
    const response = await Review.getAllByIdUser(id_user);
    return res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong fetching user's reviews (╯°□°）╯ ",
      error: error.message,
    });
  }
};

/*Valido tres casos de uso:
1. El review no existe, pero el rating sí
2.- Neither review record exists nor rating record exists
3.- El registro de rating existe,  pero el review no, entonces solo se actualiza 
la entidad de rating, si es necesario, si es requerido*/
export const createOrUpdateReview = async (req, res) => {
  try {
    const { id_user, id_tmdb, review, has_spoilers, rating } = req.body;

    //un review SIEMPRE necesita un rating
    if (typeof rating !== "number" || rating < 1 || rating > 5 || !review) {
      return res.status(400).json({
        success: false,
        message: "Review text and a rating between 1 and 5 are required",
      });
    }
    // busco o creo el rating
    let ratingRecord = await Rating.findByUserAndMubi(id_user, id_tmdb);
    console.log("Este es mi ratingRecord", ratingRecord);
    if (ratingRecord) {
      await Rating.updateById(ratingRecord.id, rating);
    } else {
      const newRatingId = await Rating.createNew({ id_user, id_tmdb, rating });
      ratingRecord = { id: newRatingId, id_user, id_tmdb, rating };
    }

    //busco si existe el review
    const reviewRecord = await Review.findByUserAndTmdbId(id_user, id_tmdb);
    if (reviewRecord) {
      await Review.updateByOwnId(reviewRecord.id, {
        id_rating: ratingRecord.id,
        review,
        has_spoilers,
      });

      return res.json({
        success: true,
        message: "Review updated successfully",
        data: {
          id: reviewRecord.id,
          id_user,
          id_tmdb,
          rating,
          review,
          has_spoilers,
        },
      });
    }
    //creo el review nuevo
    const newReview = await Review.addReview({
      id_user,
      id_tmdb,
      id_rating: ratingRecord.id,
      review,
      has_spoilers,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error", error });
  }
};
