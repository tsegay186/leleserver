
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var postSchema = new Schema({
  authorId: {
    type: mongoose.ObjectId,
    required: true
  },
  postType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  recievers: [],
  likes: [],
  deslikes: [],
  shares: [],
  comments: [],
  content: {},
  whoCanSeeIt:{
    type:String,
    default:'public'
  }
}, { versionKey: false });
module.exports = new mongoose.model('post', postSchema)