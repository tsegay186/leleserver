
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isConfirmed: { type: Boolean, defualt: false },
  avaterUrl:{ type: String, default: "http://localhost:3000/avater.jpg"} ,
  coverPhotoUrl:{ type: String, default: "http://localhost:3000/cover.jpg"} ,
  friends:[],
  notifications:[],
  friendRequiests:[],
  bio:{type: String},
  created_at: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = new mongoose.model('user', userSchema)

