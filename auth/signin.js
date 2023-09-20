const express = require('express')
const router = express.Router()
const userModel = require('../models/mongoosemodels/user')
const Jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

router.post('/', (req, res) => {
    userModel.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            return res.status(200).send({ error: 'internal eror try again' })
        }
        else {
            if (!result) {
                res.status(200).send({ error: `invalid sign in attempt` })
            }
            else {
                if (bcrypt.compareSync(req.body.password, result.password)) {

                    const dta = Object.assign({}, result._doc)
                    delete dta.password
                    delete dta.isConfirmed
                    delete dta.created_at
                    console.log(dta)

                    const user = { _id: result._id, username: result.username };
                    const token = Jwt.sign(user, 'my_secret');
                    const userData = {
                        token,
                        ...dta
                    }
                    res.status(200).json(userData)
                    /* if (result.isConfirmed) {
 
                         const user = { _id: result._id, username: result.username };
                         const token = Jwt.sign(user, 'my_secret');
                         res.status(200).json({ user, token })
                     } else {
                         res.send({ error: "looks like you didn't confirm your email" ,email:result.email})
                     }*/
                }
                else
                    res.status(200).send({ error: "invalid sign in attempt" })
            }
        }
    })
})


module.exports = router