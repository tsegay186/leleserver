
const expres = require('express')
const postModel = require('../../models/mongoosemodels/post')
const commentModel = require('../../models/mongoosemodels/comment')
const joi = require('@hapi/joi')
const router = expres.Router();

router.get('/ahiyos', (req, res) => {
    postModel.find({}, (err, result) => {
        if (err) {
            console.log({ error: err.message })
        } else {
            if (result) {
                res.send(result)
            } else {
                console.log({ error: 'no posts are available yet' })
            }
        }
    })
})

router.post('/', (req, res) => {

    const post = new postModel({
        authorId: req.body.authorId,
        postType: req.body.postType,
        whoCanSeeIt: req.body.whoCanSeeIt,
        content: req.body.content
    })
    post.save((err, data) => {
        if (err) {
            res.send({ error: err.message })
        } else {
            res.send(data)
        }
    })
})

router.post('/edit/:postId', (req, res) => {
    postModel.findOneAndUpdate({ _id: req.params.postId }, req.body, { new: true }, (err, result) => {
        if (err) {
            res.send({ error: err.message })
        } else {
            res.send(result)
        }
    })
})

router.post('/delete/:postId', (req, res) => {
    const postId = req.params.postId
    postModel.findOneAndDelete({ _id: postId }, (err, result) => {
        if (err) {
            res.send({ error: 'something goes wrong' })
        } else {
            res.send({ success: 'deleted successfully' })
        }
    })
})
router.post('/ahiyo', (req, res) => {
    const schema = joi.object({
        talkerContent: joi.array().items(joi.string()),
        recieverContent: joi.array().items(joi.string())
    })
    schema.validateAsync(req.body.content).then(result => {
        const post = new postModel({
            authorId: req.body.authorId,
            postType: req.body.postType,
            content: result
        })
        post.save((err, data) => {

            if (err) {
                console.log({ error: err.message })
            } else {
                console.log(data)
            }
        })
    }).catch(err => {
        console.log({ error: err.message })
    })
})
// Like,Deslike,Share
router.post('/ahiyo/LDS/:id', (req, res) => {
    const field = req.body.field
    const postId = req.params.id;
    const LDSer = {
        userId: req.body.userId,
        likedOn: new Date()
    }
    postModel.findOne({ _id: postId }, (err, result) => {
        if (err) {
            res.sendStatus(500)
        } else {
            result[field].push(LDSer)
            result.save();
            res.sendStatus(200)
        }
    });
})

// unLike,unDeslike,unShare
router.post('/ahiyo/unLDS/:id', (req, res) => {
    const field = req.body.field
    const postId = req.params.id;
    const unLDSer = {
        userId: req.body.userId,
    }
    postModel.findOne({ _id: postId }, (err, result) => {
        if (err) {
            res.sendStatus(500)
        } else {
            const unlds = result[field].find(x => x.userId == unLDSer.userId)
            result[field].pull(unlds)
            result.save();
            res.sendStatus(200)
        }
    })
})

/*router.post('/ahiyo/comment/:id', (req, res) => {

    const postId = req.params.id;
    console.log(req.body)
    const comment = {
        userId: req.body.userId,
        comment: req.body.comment,
        commentedOn: new Date()
    }
    postModel.findOne({ _id: postId }, (err, result) => {
        if (err) {
            res.sendStatus(500)
        } else {
            //result.comments=[]
            result.comments.push({ $each: [comment], $position: 0 })
            result.save((err, result) => {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.sendStatus(500)
                }
            });
        }
    });
})*/

router.post('/defualt/writecomment/:postId', (req, res) => {

    const postId = req.params.postId;
    const comment = new commentModel({
        authorId: req.body.authorId,
        commentedTo: postId,
        content: req.body.content,
    })
    postModel.findOne({ _id: postId }, (err, result) => {
        if (!result || err) {
            res.send({ error: 'internal server error. try again' })
        } else {
            result.comments.push({ $each: [comment], $position: 0 })
            result.save((err, result) => {
                if (err) {
                    res.send({ error: err.message })
                } else {
                    res.send(comment)
                }
            });
        }
    });
})

router.post('/defualt/writereplay/:postId', (req, res) => {

    const postId = req.params.postId;
    const replay = new commentModel({
        authorId: req.body.authorId,
        commentedTo: req.body.commentedTo,
        content: req.body.content,
    })

    postModel.findOne({ _id: postId }, (err, result) => {
        if (!result || err) {
            res.send({ error: 'internal server error. try again' })
        } else {
            let id = `${replay.commentedTo}`
            result.comments.find(comment => comment._id == id).replays.push(replay)
            result.save((err, data) => {
                if (err) {
                    res.send({ error: err.message })
                } else {
                    postModel.findOneAndUpdate({ _id: postId }, data, { new: true }, (err, value) => {
                        if (err) {
                            res.send(err.message)
                        } else {
                            res.send(value)
                        }
                    })
                }
            });
        }
    });

})

router.post('/defualt/likecomment/:postId/:commentId', (req, res) => {

    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const userId = req.body.userId;

    postModel.findOne({ _id: postId }, (err, result) => {
        if (!result || err) {
            res.send({ error: 'internal server error. try again' })
        } else {

            let index = result.comments.find(comment => comment._id == commentId).likes.findIndex(like => like.userId == userId)
            if (index != -1) {
                result.comments.find(comment => comment._id == commentId).likes.splice(index, 1)
            } else {
                const like = {
                    userId,
                    likedOn: new Date()
                }
                result.comments.find(comment => comment._id == commentId).likes.unshift(like)
            }
            result.save((err, data) => {
                if (err) {
                    res.send({ error: err.message })
                } else {
                    postModel.findOneAndUpdate({ _id: postId }, data, { new: true }, (err, value) => {
                        if (err) {
                            res.send(err.message)
                        } else {
                            res.send(value)
                        }
                    })
                }
            });
        }
    });

})

router.post('/editcomment', (req, res) => {

    const postId = req.body.postId
    const commentId = req.body.commentId

    postModel.findOne({ _id: postId }, (err, result) => {
        if (!!err) {
            res.send({ error: err.message })
        } else {
            if (result) {
                result.comments.find(comment => comment._id == commentId).content = req.body.content
                result.save((err, updatedData) => {
                    if (err) {
                        res.send({ error: err.message })
                    } else {
                        postModel.findOneAndUpdate({ _id: postId }, updatedData, { new: true }, (err, rsult) => {
                            if (err) {
                                res.send({ error: err.message })
                            } else {
                                res.send(rsult)
                            }
                        })
                    }
                })

            } else {
                res.send({ error: 'spmething goes wrong try later' })
            }
        }
    })
})

router.post('/editreplay/:postId/:commentId', (req, res) => {

    const postId = req.params.postId
    const commentId = req.params.commentId
    const replayId = req.body.replayId
    const content = req.body.content

    postModel.findOne({ _id: postId }, (err, result) => {
        if (!!err) {
            res.send({ error: err.message })
        } else {
            if (result) {
                result.comments
                    .find(comment => comment._id == commentId).replays
                    .find(replay => replay._id == replayId).content = content
                result.save((err, updatedData) => {
                    if (err) {
                        res.send({ error: err.message })
                    } else {
                        postModel.findOneAndUpdate({ _id: postId }, updatedData, { new: true }, (err, rsult) => {
                            if (err) {
                                res.send({ error: err.message })
                            } else {
                                res.send(rsult)
                            }
                        })
                    }
                })

            } else {
                res.send({ error: 'spmething goes wrong try later' })
            }
        }
    })
})

router.post('/deletereplay/:postId/:commentId', (req, res) => {
    const postId = req.params.postId
    const commentId = req.params.commentId
    const replayId = req.body.replayId
    postModel.findOne({ _id: postId }, (err, result) => {
        if (!!err) {
            res.send({ error: err.message })
        } else {
            const index = result.comments.
                find(comment => comment._id == commentId).replays.
                findIndex(replay => replay._id == replayId)

            if (index != -1) {
                result.comments.find(comment => comment._id == commentId).replays.splice(index, 1)
                result.save((err, updatedData) => {
                    if (err) {
                        res.send({ error: err.message })
                    } else {
                        postModel.findOneAndUpdate({ _id: postId }, updatedData, { new: true }, (err, rsult) => {
                            if (err) {
                                res.send({ error: err.message })
                            } else {
                                res.send(rsult)
                            }
                        })
                    }
                })
            } else {
                res.send({ error: 'invalid attempt' })
            }
        }
    })
})

router.post('/deletecomment', (req, res) => {
    const postId = req.body.postId
    const commentId = req.body.commentId
    postModel.findOne({ _id: postId }, (err, result) => {
        if (!!err) {
            res.send({ error: err.message })
        } else {
            const index = result.comments.findIndex(comment => comment._id == commentId)
            result.comments.splice(index, 1)
            result.save((err, updatedData) => {
                if (err) {
                    res.send({ error: err.message })
                } else {
                    postModel.findOneAndUpdate({ _id: postId }, updatedData, { new: true }, (err, rsult) => {
                        if (err) {
                            res.send({ error: err.message })
                        } else {
                            res.send({ index })
                        }
                    })
                }
            })
        }
    })
})
module.exports = router;