const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')

router.post('/', (req, res) => {

    const requesteeId = req.body.requesteeId
    let username = undefined
    userModel.findById({ _id: req.body.requesterId }, (err, result) => {
        if (err) {
            res.send("unknown")
        } else {
            username = result.username
        }
    }).then(() => {
        userModel.findById({ _id: requesteeId }, (err, result) => {
            if (err || !result) {
                res.send({ error: 'an error happened try later !' })
            } else {

                const request = {
                    userId: req.body.requesterId,
                    requestTime: Date.now()
                }
                result.friendRequiests.push(request)
                result.save((err, data) => {
                    if (err) {
                        res.send({ error: 'an error happened try later !' })
                    } else {
                        const notification = {
                            userId:  req.body.requesterId ,
                            reason: `${username} send you friend request`,
                            notificationTime: Date.now()
                        }
                        data.notifications.unshift(notification)
                        data.save((err, dat) => {
                            if (err) {
                                res.send({ error: 'an error happened try later !' })
                            } else {
                                res.send({userId:data._id,friendRequiests:data.friendRequiests, notifications: data.notifications})
                            }
                        })
                    }
                });
            }
        })
    })
})

module.exports = router