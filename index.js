//Importamos la libreria express
import express from "express";
//Importamos la libreria cors
import cors from "cors";
//Importamos las rutas de productos
import productsRoutes from "./src/routes/products.routes.js";
//Importamos las rutas de autenticacion
import authRouter from "./src/routes/auth.routes.js";
//Importamos la libreria bodyParser para leer JSON en el body
import bodyParser from "body-parser";

//Declaramos la aplicacion express
const app = express();

//Configuracion de CORS desde su libreria (CORS es un mildware)
app.use(
  cors({
    origin: "*",
  }),
);

// Configuración de bodyParser para leer JSON en el body
app.use(bodyParser.json());

//Indicamos a Express que lea JSON en el body // Borrar antes de entregar //
app.use(express.json());

//Declaramos un mildaware "console.log para debuguear"
app.use((req, res, next) => {
  console.log(`Datos recibidos: ${req.method} ${req.url}`);
  next();
});

//Ruta base (devuevle HTML)
app.get("/", (req, res) => {
  res.send("PROYECTO FINAL");
});

//Declaro ruta de autentificación
app.use("/auth", authRouter);

//Declaro ruta de productos
app.use("/api", productsRoutes);

//Declaramos el mildaware 404
app.use((req, res, next) => {
  res.status(404).json({
    error: "404 - Ruta no encontrada",
    mensaje: `El recurso ${req.url}, no existe!`,
  });
});

//Declaramos el puerto
const PORT = 3000;
//Levantamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
