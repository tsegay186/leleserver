const Joi = require('@hapi/joi');
const changepassword = Joi.object({
    currentPassword: Joi.string().required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
    newPassword: Joi.string().required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
    confirmPassword: Joi.ref('newPassword')

})
module.exports = changepassword