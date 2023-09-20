const express = require('express')
const router = express.Router()
const userModel = require('../models/mongoosemodels/user')
const Jwt = require('jsonwebtoken')

router.get('/:username/:token', (req, res) => {

    const username = req.params.username;
    const token = req.params.token;
    userModel.findOne({ username: username }, function (err, user) {
        if (err) {
            res.status(200).send({ error: err.message })
        }
        else {
            if (user) {
                const secrete = user.password
                const payload = Jwt.verify(token, secrete)
                if (payload._id == user._id) {
                    userModel.findOneAndUpdate({ _id: payload._id }, { isConfirmed: true })
                        .then(() => res.status(202).send({ success: "Email confirmed successfully" }))
                        .catch(err => res.status(500).send({ error: err.message }))
                }
                else {
                    res.status(200).send({ error: 'wrong confirmation link' })
                }
            }
            else res.send({ error: 'invalid confirmation token' })
        }

    })
})
module.exports = router