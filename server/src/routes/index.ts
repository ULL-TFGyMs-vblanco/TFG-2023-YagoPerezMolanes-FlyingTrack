import { Router } from "express";
import User from '../models/User';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', (req, res) => res.send('Hello World'));

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  // console.log(name, email, password);
  const newUser = new User({name, email, password});
  await newUser.save();

  const token = jwt.sign({_id: newUser._id}, 'secretKey')
  console.log(newUser);

  res.status(200).json({token});
  // res.send('register');
});

// export default router;
module.exports = router;