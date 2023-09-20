const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')
const validPassword = require('../../models/Joimodels/changePassword')
const bcrypt = require('bcryptjs')

router.post('/:_id', (req, res) => {

    const find = req.params

    userModel.findOne(find, (err, result) => {
        if (!result) {
            res.send({ error: `please don't mess with us` })
        } else {
            if (bcrypt.compareSync(req.body.currentPassword, result.password)) {
                validPassword.validateAsync(req.body)
                    .then(
                        resul => {
                            console.log(resul.newPassword)
                            const hash = bcrypt.hashSync(resul.newPassword, 10)
                            result.password = hash
                            result.save().then(saveddoc => {
                                res.send({ message: 'password changed successfully' })
                            })
                        }
                    )
                    .catch(err => res.send({ error: err.message }))
            }
            else {
                res.send({ error: 'process failed try again' })
            }
        }
    }).catch(err => {
        res.send({ error: err.message })
    })


})
module.exports = router