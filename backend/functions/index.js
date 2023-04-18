const functions = require("firebase-functions");
const express = require("express");
require("./database");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();

app.get("/", (req, res) => {
  res.send("Flying Track FT");
});

exports.app = functions.https.onRequest(app);
