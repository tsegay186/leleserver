const Joi = require('@hapi/joi');
const rstpwd = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),
    newPassword: Joi.string().required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
    confirmPassword: Joi.ref('newPassword'),
    token: Joi.string().required()

})
module.exports = rstpwd