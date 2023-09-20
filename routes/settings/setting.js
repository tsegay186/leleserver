const express = require('express');
const app = express();

const updateemailandusername = require('./updateemailandusername')
const changepassword = require('./changepassword')
const addbio = require('./basicinfo')

app.use('/changepassword',changepassword)
app.use('/account',updateemailandusername)
app.use('/addbio', addbio)

module.exports = app