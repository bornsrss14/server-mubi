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
1. Review doesn't exist, but rating does.
2.- Neither review record exists nor rating record exists
3.- Rating record exists, but review doesn't, therefore it only updates the entity of rating,
 if it's necessary
*/
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

export const getReviewsByMubi = async (req, res) => {
  try {
    const { id_tmdb } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    // rejects concatened strings and number "1024dk", NaN, decimalas, and negative numbers
    if (!Number.isInteger(page) || page < 1) {
      throw new Error("Invalid page number");
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error("Invalid limit number");
    }
    const offset = (page - 1) * limit;
    console.log("Backend request:", { id_tmdb, page, limit, offset }); //log➜

    const [reviews, total] = await Promise.all([
      Review.getByMovie(id_tmdb, limit, offset),
      Review.countByMovie(id_tmdb),
    ]);
    const hasMore = offset + reviews.length < total;
    console.log("Backend response:", {
      reviewsCount: reviews.length,
      total,
      offset,
      hasMore,
    }); //  Log ➜

    res.json({
      success: true,
      data: reviews,
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
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

export const getByMovieAndId = async (req, res) => {
  try {
    const { id_tmdb, id } = req.params;
    const reviewDetail = await Review.getByMovieAndReview(id_tmdb, id);
    res.json({ success: true, data: reviewDetail });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching review detail from the movie ${id_tmdb}`,
      error: error.message,
    });
  }
};
