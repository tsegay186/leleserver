const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')

router.post('/', (req, res) => {
    const unfrienderId = req.body.unfrienderId
    const unfriendeeId = req.body.unfriendeeId

    userModel.findById({ _id: unfrienderId }, (err, result) => {
        if (err) {
            res.send({ error: "error ocured " })
        } else {
            const index = result.friends.find(friend => friend.userId == unfriendeeId)
            if (index != -1) {
                result.friends.splice(index, 1)

            } else {
                res.send({ error: "an error happened try later !" })
            }
            result.save((err, dat) => {
                if (err) {
                    res.send({ error: 'an error happened try later !' })
                } else {
                    userModel.findById({ _id: unfriendeeId }, (err, user) => {
                        if (err) {
                            res.send({ error: 'an error happened try later !' })
                        } else {
                            const index = user.friends.find(friend => friend.userId == unfrienderId)
                            if (index != -1) {
                                user.friends.splice(index, 1)
                                user.save((err, updatedUser) => {
                                    if (err) {
                                        res.send({ error: err.message })
                                    } else {
                                        res.send({ userId: dat._id, friends: dat.friends })
                                    }
                                })

                            } else {
                                res.send({ error: "an error happened try later !" })
                            }
                        }
                    })
                }
            })
        }
    })
})

module.exports = router