const express = require('express')
const router = express.Router()
const userModel = require('../models/mongoosemodels/user')
const Jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const EmailService = require('../EmailServices/EmailService')
const valid_user = require('../models/Joimodels/validuser');
const findByEmail = require('./functions/findByEmail')
const findByUserName = require('./functions/findByUserName')

router.post('/', (req, res) => {
    valid_user.validateAsync(req.body).then(result => {
        const hash = bcrypt.hashSync(result.password, 10);
        const user = new userModel({
            username: result.username,
            email: result.email,
            password: hash,
            isConfirmed: false,
        })
        console.log(user)
        return user;
    })
        .then((user) => {
            findByUserName(user.username, false, (error, result) => {
                if (!error) {
                    if (result) {
                        findByEmail(user.email, false, (error, result) => {
                            if (!error) {
                                if (result) {
                                    const use = {
                                        _id: result._id,
                                        username: result.username,
                                        email: result.email
                                    }
                                    user.save(function (error, result) {
                                        if (error) {
                                            res.status(500).send({ error: 'Internal server error' })
                                        }
                                        else {
                                            const token = Jwt.sign({ _id: result._id, email: result.email }, result.password)
                                            const mailOptions = {
                                                from: process.env.username,
                                                to: result.email,
                                                subject: 'Sending Email verification link',
                                                text: 'Please click the link to confirm your account',
                                                html: `<a href="http://localhost:3000/auth/confirmemail:${token}" blank>http://localhost:3000/auth/confirmemail:${token}</a>`
                                            }
                                            EmailService.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    res.send({ success: `regestered succfully`, error: "we got problem with sending email confirmation link so make sure your email is real valid mail address" })
                                                } else {
                                                    res.send({ data: use, message: 'see your email we send you a link to confirm your email' })
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    res.send({ message: 'email is in use try to use another email' })
                                    //nullreturn  
                                }
                            }
                            else {
                                res.status(500).send({ message: 'enternal server error try again' })
                                // return null; 
                            }
                        })
                    }
                    else {
                        res.send({ message: 'user name is not available' })
                        //  return null  
                    }
                }
                else {
                    res.status(500).send({ message: 'enternal server error try again' })
                    //return null
                }
            })
            console.log(user)
        }, error => {
            res.send({ error: error.details[0].message })
        })

})

module.exports = router