const Schema, model = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: String,
  password: String, 
}, {
  timestamps: true
});

// module.exports.default = model('User', userSchema);

export default model('User', userSchema);