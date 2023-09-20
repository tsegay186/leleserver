const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')

router.post('/:_id', (req, res) => {

    const find = req.params
    const update = req.body
    userModel.findOneAndUpdate(find, update, { new: true }).then(result => {
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