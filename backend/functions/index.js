const functions = require("firebase-functions");
const express = require("express");

// importamos el fichero de conexion con la base de datos
require("./database");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// creamos el servidor express
const app = express();

// importamos el objeto router donde se encuentran las rutas
app.use(require("./routes/index"));

// convertimos los datos que esta recibiendo el servidor en un objeto de
// javascript que voy a poder manejar
app.use(express.json());
app.set("port", (process.env.PORT || 3000));

// el servidor escucha en el puerto 4000
// app.listen(4000);
// console.log("Server on port", 4000);


// exporta la aplicacion para que la podamos crear en firebase functions, y
// dentro de cada peticion se pueda devolver nuestra api
exports.app = functions.https.onRequest(app);
