const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')

router.post('/', (req, res) => {
    const denyerId = req.body.denyerId
    const denyeeId = req.body.denyeeId
    userModel.findById({ _id: denyerId }, (err, result) => {
        if (err) {
            res.send({ error: "error ocured " })
        } else {
            const index = result.friendRequiests.findIndex(request => request.userId == denyeeId)
            if (index != -1) {
                result.friendRequiests.splice(index, 1)
                result.save((err, dat) => {
                    if (err) {
                        res.send({ error: 'an error happened try later !' })
                    } else {
                        res.send({ userId: dat._id, friendRequiests: dat.friendRequiests })
                    }
                })
            } else {
                res.send({ error: "an error happened try later !" })
            }

        }
    })
})

module.exports = router