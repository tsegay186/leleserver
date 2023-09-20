const expres = require('express')
const EmailService = require('../EmailServices/EmailService')
const Jwt = require('jsonwebtoken')
const userModel = require('../models/mongoosemodels/user')

const router = expres.Router();

router.post('/', (req, res) => {
    console.log(req.body)
    const email = req.body.email
    userModel.findOne({ email: email }, (err, user) => {
        if (err)
            res.status(500).send({ error: 'internal server error' })
        else {
            if (user) {
                const secrete = user.password
                const payload = { _id: user._id, username: user.username };//payload
                const token = Jwt.sign(payload, secrete);
                var mailOptions = {
                    from: process.env.username,
                    subject: 'password reset link',
                    to: email,
                    html: `<div>click <a href="http://localhost:8080/resetpassword/?username=${user.username}&token=${token}">here</a>to reset your password <div>`
                };
                EmailService.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.send({ error: 'unabling to send you password reset link try again' });
                    } else {
                        res.send({ success: 'check your email. we have sent you password reset link' });
                    }
                })
            }
            else {
                res.send({ error: 'are you sure?you registered with this email' })
            }
        }
    })
})


module.exports = router