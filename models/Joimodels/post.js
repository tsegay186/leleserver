const Joi = require('@hapi/joi');
const mongoose = require('mongoose')
const objectId = mongoose.objectId
const post = Joi.object({
    authorId: objectId,
    content: {
        talkerContent: [Joi.string().min(3)],
        recieverContent: [Joi.string().min(3)]
    }


})
module.exports = post

