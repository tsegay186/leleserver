const express = require('express')
const Jwt = require('jsonwebtoken')
const userModel = require('../models/mongoosemodels/user')
const EmailService = require('../EmailServices/EmailService')

const router = express.Router()

router.post('/', (req, res) => {
    const email = req.body.email
    userModel.findOne({ email: email }, function (error, data) {
        if (!error) {
            if (data) {
                if (!data.isConfirmed) {
                    console.log(data)
                    const token = Jwt.sign({ _id: data._id, email: data.email }, data.password)
                    const mailOptions = {
                        from: process.env.username,
                        to: data.email,
                        subject: 'Sending Email verification link',
                        text: 'Please click the link to confirm your account',
                        html: `<div><p>click <a href="http://localhost:8080/confirmemail?username=${data.username}&token=${token}" blank>here</a> to confirm your email</p></div>`
                    }
                    EmailService.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.send({ error: 'problem with sending confirmation link to your email' })
                        } else {
                            res.send({ success: `we sent you a link to confirm your email.check your email` })
                        }
                    })
                } else {
                    res.send({ error: 'do not mess with us!' })
                }
            } else {
                res.send({ error: 'are you sure you create your account with this email!' })
            }
        } else {
            res.send({ error: 'internal server error' })
        }
    })
})


module.exports = router