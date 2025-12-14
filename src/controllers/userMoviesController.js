import UserMoviesFav from "../models/userMoviesModel.js";

export const getLiked = async (req, res) => {
  try {
    const { id_user } = req.params;
    const movies = await UserMoviesFav.getLikedMovies(id_user);

    return res.json({
      id_user,
      /* display how many movies have X user avoiding extra req; pagination*/
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getToWatch = async (req, res) => {
  try {
    const { id_user } = req.params;
    const movies = await UserMoviesFav.getToWatchMovies(id_user);
    return res.json({
      id_user,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getWatched = async (req, res) => {
  try {
    const { id_user } = req.params;
    const movies = await UserMoviesFav.getWatchedMovies(id_user);
    return res.json({
      id_user,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const toggleUserMovie = async (req, res) => {
  try {
    const { id_user, id_tmdb } = req.params;
    const { field } = req.body;

    const validFields = ["liked", "watched", "to_watch"];
    if (!validFields.includes(field)) {
      return res.status(400).json({ error: "Invalid field" });
    }

    // Buscar registro
    const existing = await UserMoviesFav.findRecord(id_user, id_tmdb);

    // Si no existe → crear registro y activar ese campo
    if (!existing) {
      await UserMoviesFav.addRecord(id_user, id_tmdb, field);
      return res.json({ message: "Created with field activated", [field]: 1 });
    }

    // Valor actual
    const currentValue = existing[field];

    // Cambiar valor (toggle)
    const newValue = currentValue === 1 ? 0 : 1;
    await UserMoviesFav.updateField(id_user, id_tmdb, field, newValue);

    // Si se activó → devolver respuesta inmediata
    if (newValue === 1) {
      return res.json({ message: "Field activated", [field]: 1 });
    }

    // Si se desactivó → recargar la fila para ver si quedó vacía
    const updated = await UserMoviesFav.findRecord(id_user, id_tmdb);

    // Si ya no existe la fila, ya fue eliminada
    if (!updated) {
      return res.json({ message: "Record deleted automatically" });
    }

    const allZero =
      updated.liked === 0 && updated.watched === 0 && updated.to_watch === 0;

    if (allZero) {
      await UserMoviesFav.deleteIfEmpty(id_user, id_tmdb);
      return res.json({ message: "Field disabled and record deleted" });
    }

    return res.json({ message: "Field disabled", [field]: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMovieStatus = async (req, res) => {
  try {
    const { id_user, id_tmdb } = req.params;
    const record = await UserMoviesFav.findRecord(id_user, id_tmdb);
    if (!record) {
      return res.json({
        liked: 0,
        watched: 0,
        to_watch: 0,
      });
    }
    return res.json({
      liked: record.liked,
      watched: record.watched,
      to_watch: record.to_watch,
    });
  } catch (error) {
    console.error(error);
    res.status.json({ error: "Server error, i guess" });
  }
};
