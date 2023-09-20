const express = require('express')
const Jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userModel = require('../models/mongoosemodels/user')
const postResetPwd = require('../models/Joimodels/password')



const router = express.Router()

router.get('/:username/:token', (req, res) => {

    const username = req.params.username;
    const token = req.params.token;

    userModel.findOne({ username: username }, function (err, user) {
        if (err) {
            res.status(200).send({ error: error.message })
        }
        else {
            console.log('user found with the required email')
            const secrete = `${user.password} ${user._id}`;
            console.log(user.password)
            try {
                var decoded = Jwt.verify(token, secrete);
                if (decoded._id == user._id) {
                    res.status(200).send(
                        {
                            success: 'enter new password',
                            data: { username: username, token: token }
                        })
                }
                else {
                    res.send({ error: 'invalid params' })
                }

            } catch (err) {
                res.status(400).send({ error: err.message })
            }
        }

    })

})

router.post('/:username/:token', (req, res) => {
    console.log(req.body)
    console.log({ username: req.params.username, token: req.params.token })
    const data = {
        username: req.params.username,
        newPassword: req.body.newPassword,
        confirmPassword: req.body.confirmPassword,
        token: req.params.token
    }
    postResetPwd.validateAsync(data).then(data => {
        userModel.findOne({ username: data.username }, function (err, user) {
            if (err) {
                res.status(200).send({ error: 'internal server error' })
            }
            else {
                if (user) {
                    try {
                        const secrete = user.password
                        console.log(secrete)
                        var decoded = Jwt.verify(data.token, secrete);
                        console.log(decoded)
                        if (decoded._id == user._id) {
                            const hash = bcrypt.hashSync(data.newPassword, 10);
                            userModel.findOneAndUpdate({ _id: decoded._id }, { password: hash })
                                .then(() => res.status(202).send({ success: "password reseted successfully" }))
                                .catch(err => res.status(500).send({ error: err.message }))
                        }
                        else {
                            res.status(200).send({ error: 'wrong params' })
                        }
                    } catch (err) {
                        res.status(200).send({ error: "invalid token" })
                    }
                }
                else {
                    res.status(200).send({ error: 'You provided fake link' })
                }
            }
        })
    })
})


module.exports = router