const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')

router.post('/', (req, res) => {

    const requesteeId = req.body.requesteeId
    const requesterId = req.body.requesterId
    userModel.findById({ _id: requesteeId }, (err, result) => {
        if (err || !result) {
            res.send({ error: 'an error happened try later !' })
        } else {

            const index1= result.friendRequiests.findIndex(request => request.userId == requesterId)
            const index2 = result.notifications.findIndex(request => request.userId == requesterId)
            if (index1 != -1 && index2 !=-1 ) {
                result.friendRequiests.splice(index1, 1)
                result.notifications.splice(index2, 1)
                result.save((err, data) => {
                    if (err) {
                        res.send({ error: 'an error happened try later !' })
                    } else {
                     res.send({userId:data._id,friendRequiests:data.friendRequiests,notifications:data.notifications})
                    }
                });
            } else {
                res.send({ error: 'wrong  action attempt' })
            }

        }
    })
})

module.exports = router