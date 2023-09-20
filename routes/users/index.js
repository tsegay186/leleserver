const express = require('express');
const app = express();

const userModel = require('../../models/mongoosemodels/user')
const deleteaccount = require('./deleteaccount')
const updateInfo = require('./update')
const requestFriendShip = require('./requestFriendship')
const cancelRequest = require('./cancelRequestFriendship')
const confirmFriendShip = require('./confirmFriendship')
const unfrienduser = require('./unfrienduser')
const denyFriendRequest = require('./denyFriendship')
//delete user account
app.use('/deleteaccount', deleteaccount)
app.use('/setting', updateInfo)
app.use('/requestfriendship', requestFriendShip)
app.use('/cancelrequest',cancelRequest)
app.use('/confirmfriendrequest',confirmFriendShip)
app.use('/unfriend',unfrienduser)
app.use('/denyfriendrequest',denyFriendRequest)
app.get('/', (req, res) => {
    userModel.find({}, (err, result) => {
        if (err) {
            res.send({ error: err.message })
        } else {
            if (result) {
                res.send(result)
            } else {
                res.send({ error: 'no users are available yet' })
            }
        }
    })
})

app.get('/:_id', (req, res) => {
    const find = req.params
    userModel.find(find, (err, result) => {
        if (err) {
            res.send({ error: err.message })
        } else {
            if (result) {
                const user = Object.assign({}, result._doc)
                delete user.password
                delete user.isConfirmed
                delete user.created_at
                res.send(user)
            } else {
                res.send({ error: error.message })
            }
        }
    })
})


app.get('/search', (req, res) => {
    const username = req.query.username;
    userModel.find({}, (err, users) => {
        if (err) {
            res.send({ error: err.message })
        } else {
            if (users) {
                const resultFound = users.filter(user => user.username.includes(username))
                if (resultFound.length) {
                    const searchs = resultFound.map(result => ({ _id: result._id, username: result.username }))
                    res.send(searchs)
                }
                else {
                    res.send({ message: 'search not found' })
                }
            }
            else {

                res.send({ message: 'search not found' })
            }
        }
    })
})

module.exports = app