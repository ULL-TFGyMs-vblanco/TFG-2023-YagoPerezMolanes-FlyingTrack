const mongoose = require("mongoose");

// esquema para el documento de la base de datos
// de mongodb referenciado al objeto usuario

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}, {
  // guarda la hora en la que se creo
  timestamps: true,
});

// exporta el modelo creado con el esquema
module.exports = mongoose.model("User", userSchema);
