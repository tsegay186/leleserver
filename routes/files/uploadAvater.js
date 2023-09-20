const express = require('express')
const router = express.Router()
const multer = require('multer')
const userModel = require('../../models/mongoosemodels/user')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/avaters")
    },
    filename: function (req, file, cb) {
        const mimetype = (file.originalname).split('.')
        const length = mimetype.length
        const index = length - 1
        const type = `.${mimetype[index]}` //.jpeg, .png
        cb(null, req.params.userId + type)
    }
})

const upload = multer({ storage })

router.post('/:userId', upload.single('avater'), (req, res) => {
    const file = req.file
    const url = `${req.protocol}://${req.get('host')}/avaters/${file.filename}`
    const find = { _id: req.params.userId }
    const update = {
        avaterUrl: url
    }
    userModel.findOneAndUpdate(find, update, { new: true }).then((result) => {
        const user = Object.assign({}, result._doc)
        delete user.created_at
        delete user.isConfirmed
        delete user.password
        res.send(user)
    }).catch(err => {
        res.send(err.message)
    })
})
module.exports = router