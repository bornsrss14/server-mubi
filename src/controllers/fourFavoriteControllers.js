/*Esto es a lo que se llama la lógica de negocio

1.- Se encarga de aplicar las validaciones, reglas de negocio
2.- No le interesa cómo recuperar datos, guardarlos o borrarlos (consultas SQL) ya que para 
eso tiene la capa de persistencia (Models)
4.- Aquí está la coordinación y respuestas HTTP (res, req)*/

import FavoriteFourMovies from "../models/fourFavoriteModel.js";

export const getAllFour = async (req, res) => {
  try {
    const mubis = await FavoriteFourMovies.getAllFour();
    res.json({
      success: true,
      data: mubis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong fetching four favorite movies (╯°□°）╯ ",
      error: error.message,
    });
  }
};

export const getFourById = async (req, res) => {
  try {
    const mubis = await FavoriteFourMovies.getFourById(req.params.id);
    if (!Array.isArray(mubis) || mubis.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No existen registros con este usuario",
      });
    }
    res.json({
      success: true,
      data: mubis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las películas favoritas (4)",
      error: error.message,
    });
  }
};

export const deleteFourMubi = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FavoriteFourMovies.deleteFourById(id);
    if (deleted === 0) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({
      success: true,
      message: "Movie deleted from your four favorite movies",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteByUserAndMubi = async (req, res) => {
  try {
    const { id_mubi, id_user } = req.params;
    const deleted = await FavoriteFourMovies.deleteByUserAndMubi(
      id_mubi,
      id_user
    );

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "No existen coincidencias para eliminar",
      });
    }
    res.json({
      success: true,
      message: "Movie deleted from the selected user",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "There's no match four your req",
      error: error.message,
    });
  }
};
export const addFourMubi = async (req, res) => {
  try {
    const { id_mubi, id_user } = req.body;
    //validacion de campos not null
    if (!id_mubi || !id_user) {
      return res.status(400).json({
        success: false,
        message: "Estos campos son requeridos",
      });
    }
    /*tengo que evitar duplicidad, no puedo agregar más 1 ves la misma
    película relacionada el mismo usuario*/
    const existingRelation = await FavoriteFourMovies.findByUserAndMovie(
      id_mubi,
      id_user
    );
    console.log(existingRelation);
    if (existingRelation.length > 0) {
      return res.status(409).json({
        success: false,
        message: "The movie is already added in your four favorite movies",
      });
    }
    const newFavoriteFour = await FavoriteFourMovies.addFour(req.body);

    return res.status(201).json({
      success: true,
      message: "Movie added succesfully 📩",
      data: newFavoriteFour,
    });
  } catch (error) {
    console.error(
      "Something went wrong, try adding your favorite movie later",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};
