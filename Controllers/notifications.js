const User = require('../Models/user');
const mongoose = require('mongoose');
var getTasks = async function(req,res){
    try{
        let today = new Date();
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', "Friday", 'Saturday'];
        let todayDate = today.getDate()-1;
        let todayDay = days[today.getDay()];
        let tasksDay= "tasks."+todayDay;
        let user = await User.aggregate([
            { $match: {"_id": mongoose.Types.ObjectId(req.user.id)}},
            {$unwind: "$tasks"},
            { $match: {[tasksDay]: true}},
            {
            $group:{
                _id:{
                    _id:"$_id", 
                    userName: "$userName", 
                },
                tasks:{
                    $push: {
                        _id: "$tasks._id",
                        habbitName:"$tasks.habbitName",
                        description:"$tasks.Description",
                        timeRemind:"$tasks.timeRemind"
                    }
                }
            }}
        ]); 
        res.status(200).json({
            code: 200,
            data: user
        });
    }catch(err){
        req.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

module.exports = {
    getTasks,
}