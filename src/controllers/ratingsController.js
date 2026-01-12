//importa todos los modelos de la bd
import Rating from "../models/ratingModel.js";
import User from "../models/userModel.js";

export const addOrUpdateRating = async (req, res) => {
  // voy a pasar el objeto completo destructurado
  //input {id_user,id_tmdb , rating}
  //output {id, id_user, id_tmdb, rating} return rows[0];
  try {
    const { id_user, id_tmdb, rating } = req.body;
    if (!id_user || !id_tmdb || rating == null) {
      return res.status(400).json({
        success: false,
        message: "id_user, id_tmdb y rating are requiered",
      });
    }
    const existing = await Rating.findByUserAndMubi(id_user, id_tmdb);
    if (existing) {
      await Rating.updateById(existing.id, rating);
      return res.status(200).json({
        success: true,
        data: { ...existing, rating },
      });
    } //sino, continua el bloque de ejecución
    const created = await Rating.createNew(req.body);

    return res.status(201).json({
      success: true,
      message: "User rating added successfully",
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "i ran into the same old server mistake. ",
      error: error.message,
    });
  }
};

export const deleteRating = async (req, res) => {
  //voy a eliminar el objeto por id_tmdb, y id_user, auqneu podría consiferar propio id
  //input {id_user, id_tmdb}
  // output status 404 o success: mensaje
  try {
    const { id_user, id_tmdb } = req.params;
    const existing = await Rating.findByUserAndMubi(id_user, id_tmdb);
    console.log("esto es el rating encontrado", existing);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "no match for rating search",
      });
    }
    console.log(existing);
    await Rating.deleteById(existing.id);
    res.json({
      success: true,
      message: "Rating eliminada para siempre",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "We couldn’t delete this movie. Please try again later.",
    });
  }
};

export const findOneByUserAndMovie = async (req, res) => {
  // obtener por {id_user, id_tmdb} es lo que mando como req
  // data : rating, output: id, id_user, id_tmdb, rating {obj completo ...}

  const { id_user, id_tmdb } = req.params;
  try {
    const rating = await Rating.findByUserAndMubi(id_user, id_tmdb);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "This rating doesn't exist, not yet.",
      });
    }
    res.json({ success: true, data: rating });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};

export const updateById = async (req, res) => {
  // input {id_user, id_tmdb, rating}
  // output {id_user, id_tmdb, rating}
  try {
    const { id_user, id_tmdb, rating } = req.body;
    const ratingRecord = await Rating.findByUserAndMubi(id_user, id_tmdb);
    if (!ratingRecord) {
      return res.status(404).json({
        success: false,
        message: "no match for rating search",
      });
    }
    await Rating.updateById(ratingRecord.id, rating);
    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { id_user } = req.params;
    //validar si el id_user es existente
    const existingUser = await User.getUserById(id_user);
    if (!existingUser) {
      //mensaje de error
      return res.status(404).json({
        success: false,
        message: "User record doesn't exist, not yet.",
      });
    }
    const allRatings = await Rating.getByIdUser(id_user);
    return res.json({
      success: true,
      data: allRatings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wron :/",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id, id_user } = req.params;
    const existingRecord = await Rating.getByOwnId(id, id_user);
    if (!existingRecord) {
      //mensaje de error
      return res.status(404).json({
        success: false,
        message: "Rating Record doesn't exists",
      });
    }
    return res.json({
      success: true,
      data: existingRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wron :/",
    });
  }
};
