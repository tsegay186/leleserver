const userModel = require('../../models/mongoosemodels/user')

function findByEmail(value, check = false, callback) {
    userModel.findOne({ email: value }, function (error, data) {
        if (error) {
            callback(error)
        }
        else {
            if (data === null) {
                callback(null, !check)
            }
            else {
                callback(null, check)
            }
        }
    })
}


module.exports = findByEmail