const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
  /*commentId: {
    type: mongoose.ObjectId,
    required: true
  },*/
  commentedTo: {
    type: mongoose.ObjectId,
    required: true
  },
  authorId: {
    type: mongoose.ObjectId,
    required: true
  },
  content:{type:String},
  commentedOn: { type: Date, default: Date.now },
  likes: [],
  deslikes: [],
  replays:[],
}, { versionKey: false });

module.exports = new mongoose.model('comment', commentSchema)