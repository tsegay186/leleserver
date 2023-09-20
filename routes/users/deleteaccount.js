const expres = require('express')
const router = expres.Router();
const userModel = require('../../models/mongoosemodels/user')

router.post('/:userId', (req, res) => {
    const userId = req.params.userId
    userModel.findByIdAndDelete(userId, (err,result) => {
       if(result){
           res.send({success: 'Deleted successfully'})
       }
       else{
        res.send({error: err.message})
       }
    })
})

module.exports = router