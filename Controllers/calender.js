const User = require('../Models/user');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
var serveCalendarpage = async function(req,res){

    if(req.params.userId == req.user.id){
        try{
        let today = new Date();
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', "Friday", 'Saturday'];
        let todayDate = today.getDate()-1;
        let todayDay = days[today.getDay()];
        let startDate = Math.max(0,todayDate-today.getDay());
        let dates = [];
        for(let i=startDate; i<=todayDate; i++){
            dates.push(i);
        }
        let tasksDay= "tasks."+todayDay;
        let user = await User.aggregate([
            { $match: {"_id": mongoose.Types.ObjectId(req.user.id)}},
            {$unwind: "$tasks"},
            { $match: {[tasksDay]: true}},
            {$unwind: "$tasks.Month"},
            {$match: {$expr: { $in:["$tasks.Month.date",dates]}}},
            {$group:{
                _id:{
                    _id:"$_id", 
                    userName: "$userName", 
                    task_id: "$tasks._id",
                    task_habbitName: "$tasks.habbitName",
                    task_Sunday: "$tasks.Sunday",
                    task_Monday: "$tasks.Monday",
                    task_Tuesday: "$tasks.Tuesday",
                    task_Wednesday: "$tasks.Wednesday",
                    task_Thursday: "$tasks.Thursday",
                    task_Friday: "$tasks.Friday",
                    task_Saturday: "$tasks.Saturday",

                },
                Month:{
                    $push: {
                        _id: "$tasks.Month._id",
                        date:"$tasks.Month.date",
                        done:"$tasks.Month.done"
                    }
                }
            }},{
                $addFields: {
                    days:{
                        $objectToArray: {
                            Sunday: "$_id.task_Sunday",
                            Monday: "$_id.task_Monday",
                            Tuesday: "$_id.task_Tuesday",
                            Wednesday: "$_id.task_Wednesday",
                            Thursday: "$_id.task_Thursday",
                            Friday: "$_id.task_Friday",
                            Saturday: "$_id.task_Saturday"
                        }
                    }
                }
            },
            {$group:{
                _id:{
                    _id:"$_id._id", 
                    userName: "$_id.userName", 
                },
                tasks:{
                    $push: {
                        _id: "$_id.task_id",
                        habbitName:"$_id.task_habbitName",
                        Month: "$Month",
                        Days: "$days"
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
    }else{
        req.status(403).json({
            code: 403,
            message: 'request Unauthorized'
        })
    }
} 

var toggleDate = async function(req,res){
    if(req.params.userId == req.user.id){
        try{
            //console.log(dateIndice);
            let done  = true;
            if(req.params.isDone == 'true'){
              done= false;
            }
            let doc = await User.findOneAndUpdate({
              _id: req.user.id,
              "tasks._id":req.params.taskId
            }
            ,{
              $set:{"tasks.$.Month.$[dateIndex].done": done }
            },{
              arrayFilters:[ {"dateIndex.date" : req.params.dateIndex}]
            }
            );
        
            res.status(200).json({
              code: 200,
              done,
            })
            return;
          }catch(err){
            console.log(err);
            res.status(200).json({
              code: 404
            })
            return;
          }
    }else{
        res.status(200).json({
            code: 403,
            message: 'Unauthorized Request'
        })
    }    
}

var showMonthHistory = async function(req,res){
    if(req.params.userId == req.user.id){
        try{
        let user = await User.aggregate([
            { $match: {_id: mongoose.Types.ObjectId(req.params.userId)}},
            { $unwind:"$tasks"},
            { $match: {'tasks._id': mongoose.Types.ObjectId(req.params.taskId)}},
            { $addFields:{"tasks.days": { $objectToArray: {
                Sunday: "$tasks.Sunday",
                Monday: "$tasks.Monday",
                Tuesday: "$tasks.Tuesday",
                Wednesday: "$tasks.Wednesday",
                Thursday: "$tasks.Thursday",
                Friday: "$tasks.Friday",
                Saturday: "$tasks.Saturday",
            }}}},
            { $project: {
                _id: 1,
                userName: 1,
                "tasks.habbitName": 1,
                "tasks.Description": 1,
                "tasks.Month": 1,
                "tasks.days": 1,
                "tasks.habbitType": 1
            }}
        ]);
        res.status(200).json({
            code: 200,
            data: user
        });
        }catch(err){
            console.log(err);
            res.status(200).json({
                code: 500,
                message: 'Internal Server Error'
            });    
        }

    }else{
        res.status(200).json({
            code: 403,
            message: 'Unauthorized Request'
        });
    }
}

var getSuggestions = async function(req,res){
    try{
        let response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.google_pseApikey}&cx=${process.env.google_pseCX}&q=${req.params.queryString}`);
        response = await response.json();
        let results=[]
        for(let i=0;i<6;i++){
            if(response.items && response.items[i]){
                results.push({
                    htmlTitle: response.items[i].htmlTitle,
                    link: response.items[i].link
                })
            }
        }
        res.status(200).json({
            code: 200,
            results,
        })
    }catch(err){
        console.error(err);
        res.status(200).json({
            code: 500,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    serveCalendarpage,
    toggleDate,
    showMonthHistory,
    getSuggestions
}