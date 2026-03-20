import cors from "cors";
import express from "express";

import userRoutes from "./routes/userRoutes.js";
import fourFavRoutes from "./routes/fourFavRoutes.js";
import userMoviesRoutes from "./routes/userMoviesRoutes.js";
import listsRoutes from "./routes/listRouter.js";
import ratingRoutes from "./routes/ratinRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
console.log("metodos de express");
console.log(app);

const PORT = process.env.PORT || 3001;

//Registro mis middleware globales para mi app
app.use(cors());
app.use(express.json()); //build in middleware for json
app.use(express.urlencoded({ extended: true }));

// mi ruta para usuarios
app.use("/api/users", userRoutes);
app.use("/api/four", fourFavRoutes);
app.use("/api/user-movies", userMoviesRoutes);
app.use("/api/user/lists", listsRoutes);
app.use("/api/user/ratings", ratingRoutes);
app.use("/api/user/reviews", reviewRoutes);
app.use("/api/user/reviews/comments", commentRoutes);
app.use("/api/users/auth", authRoutes);

// rutas de prueba
app.get("/", (req, res) => {
  res.json({ message: "Mi API está funcionando" });
});

// error handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Error de la parte del servidor, server",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`live server in port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});
