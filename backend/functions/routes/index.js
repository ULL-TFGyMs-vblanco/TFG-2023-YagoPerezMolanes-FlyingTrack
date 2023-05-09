const Router = require("express");

// Fichero de definicion de rutas

// eslint-disable-next-line new-cap
const router = Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Flying Track FT");
});

// creamos un usuario y lo guardamos en la base de datos, el servidor
// devuelve un token que es lo que usara la aplicacion cliente
router.post("/signUp", async (req, res) => {
  const {email, name, password} = req.body;
  const newUser = new User({email: email, name: name, password: password});
  await newUser.save();
  // const token = jwt.sign({_id: newUser._id}, "secretkey");
  res.send("hola");
  // res.status(200).json({token: token});

  // console.log(newUser);
});

router.post("/signIn", async (req, res) => {
  const {name, password} = req.body;
  const user = await User.findOne({name});
  if (!user) {
    return res.status(401).send("The username doesn't exists");
  }
  if (user.password !== password) {
    return res.status(401).send("Wrong Password");
  }

  const token = jwt.sign({id_: user.id}, "secretkey");
  res.status(200).json({token: token});
});

// exporta el objeto que contiene a las rutas
module.exports = router;
