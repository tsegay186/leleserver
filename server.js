
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors')

const posts = require('./routes/posts/index')
const users = require('./routes/users/index')
const auth = require('./auth/auth')
const settings = require('./routes/settings/setting')

const uploadAvater = require('./routes/files/uploadAvater')
const uploadCoverPhoto = require('./routes/files/uploadCoverPhoto')

const app = express()
const port = 3000;

app.use(express.static('public'))

//configuration
mongoose.connect(' mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useCreateIndex: true });

app.use(bodyParser())
app.use(cors())

app.use('/post', posts)
app.use('/users', users)
app.use('/auth', auth)
app.use('/settings', settings)
app.use('/uploadavater', uploadAvater)
app.use('/uploadcoverphoto', uploadCoverPhoto)

//routes
app.get('/', (req, res) => {
    console.log('\nrequested\n')
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
