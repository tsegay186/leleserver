const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')

router.post('/', (req, res) => {
    const confirmerId = req.body.confirmerId
    const confirmeeId = req.body.confirmeeId

    userModel.findById({ _id: confirmerId }, (err, result) => {
        if (err) {
            res.send("unknown")
        } else {
            const friend = {
                userId: confirmeeId,
                addedDate: Date.now()
            }
            result.friends.unshift(friend)
            const index = result.friendRequiests.findIndex(request => request.userId == confirmeeId)
            if (index != -1) {
                result.friendRequiests.splice(index, 1)

            } else {
                res.send({ error: "an error happened try later !" })
            }
            result.save((err, dat) => {
                if (err) {
                    res.send({ error: 'an error happened try later !' })
                } else {
                    userModel.findById({ _id: confirmeeId }, (err, user) => {
                        if (err) {
                            res.send({ error: 'an error happened try later !' })
                        } else {
                            const notification = {
                                userId: confirmerId,
                                reason: `${dat.username} accepted your friend request`,
                                notificationTime: Date.now()
                            }
                            user.friends.unshift({ userId: confirmerId, addedDate: Date.now() })
                            user.notifications.unshift(notification)
                            user.save((err, updatedUser) => {
                                if (err) {
                                    res.send({ error: err.message })
                                } else {
                                    res.send({ userId: dat._id, friends: dat.friends, friendRequiests: dat.friendRequiests, notifications: dat.notifications })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = router