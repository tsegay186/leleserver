const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')
router.post('/:_id',(req,res) => {
   const find =req.params
   const update = req.body
   console.log(update)
   console.log(update,find)
   userModel.findOneAndUpdate(find,update,{new: true}).then((result) =>{
       console.log(result)
       res.send(result)
   }).catch(err => {
       res.send(err)
   })

})
module.exports = router