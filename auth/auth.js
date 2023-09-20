
const express = require('express');
const app = express();

const signup = require('./signup')
const signin = require('./signin')
const confirmemail = require('./confirmemail')
const forgotpassword = require('./forgotpassword')
const resetpassword = require('./resetpassword')
const resendemailconfirmation = require('./resendemailconfirmation')


//signup
app.use('/signup', signup)

//signin
app.use('/signin', signin)

//confirm email
app.use('/confirmemail', confirmemail)

//forgot password
app.use('/forgotpassword', forgotpassword)

//reset password
app.use('/resetpassword', resetpassword)

//resend email confirmation
app.use('/resendemailconfirmation', resendemailconfirmation)


module.exports = app