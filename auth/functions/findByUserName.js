const userModel = require('../../models/mongoosemodels/user')

function findByUserName(value, check = false, callback) {
    userModel.findOne({ username: value }, function (error, data) {
        if (error) {
            callback(error)
        }
        else {
            if (data === null) {
                check = !check
                callback(null, check)
            }
            else {
                callback(null, check)
            }
        }
    })
}

module.exports = findByUserName