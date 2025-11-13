import cors from "cors";
import express from "express";

import userRoutes from "./routes/userRoutes.js";

const app = express();

const PORT = process.env.PORT || 3001;

//Registro mis middleware globales para mi app
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mi ruta para usuarios
app.use("/api/users", userRoutes);

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
