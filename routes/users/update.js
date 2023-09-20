const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')
router.post('/update/:_id',(req,res) => {
   const find =req.params
   const update = req.body
   userModel.findOneAndUpdate(find,update,{new: true}).then((result) =>{
       res.send(result)
   }).catch(err => {
       res.send(err)
   })

})

router.post('/addbio/:_id',(req,res) => {
    const find =req.params
    const update = req.body
    userModel.findOneAndUpdate(find,update,{new: true}).then((result) =>{
        res.send(result)
    }).catch(err => {
        res.send(err)
    })
 
 })

module.exports = router