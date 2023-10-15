const multer  = require('multer');
//const Task = require('../Models/task');
const User = require('../Models/user');
const path = require('path');
const mongoose = require('mongoose');
const {gfs} = require('../Config/mongoose')
var main = async function(req,res){
      
      const signedUser = {
        user_id: req.user.id,
        filepath: 'home'
      }
      if(req.user.profilePhoto=='null'){
        signedUser.profilePhoto = '/Uploads/sample_photo.jpg';
      }else{
        signedUser.profilePhoto =  path.join('/Uploads/getprofilePhoto',req.user.profilePhoto);
      }
      res.render('home',signedUser);
}

var servePhoto = function(req,res){
      const fileId = req.params.fileId;
      try {
          const downloadStream = gfs.gridfsBucket.openDownloadStream(mongoose.Types.ObjectId(fileId));
          downloadStream.pipe(res);
          downloadStream.on('error', (error) => {
          console.log(error); 
          });
      } catch (error) {
          console.log(error);
      }
}

var getTasks = async function(req,res){
  try{
    let today = new Date();
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', "Friday", 'Saturday'];
    let todayDate = today.getDate()-1;
    let todayDay = days[today.getDay()];
    let tasksDay= "tasks."+todayDay;
    let user = await User.aggregate([
      {$match: { "_id": mongoose.Types.ObjectId(req.user.id) }},
      { $unwind : "$tasks"},
      { $match: { [tasksDay] : true } },
    { $group : { _id : "$_id", tasks : { $addToSet : "$tasks" } }}]); 
      if(user.length>0){
          res.status(200).json({
            user_id: req.user.id,
            tasks: user[0].tasks,
            dateIndex: todayDate,
            code: 200
          });
     }else{
          res.status(200).json({
            user_id: req.user.id,
            tasks: [],
            dateIndex: todayDate,
            code: 200
          })
     }
  }catch(err){
    res.status(200).json({
      message: 'Internal Server Error',
      code: 500
    })
  }
}

var addHabbit = async function(req,res){
    
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    try{
    User.uploadDetails(req, res, async function (err) {
        if (err) {
          console.log('error occured',err);
        }
        let months = new Array(31)
        let i =0;
        for(let j=0;j<months.length;j++){
          months[j] ={
            date:i,
            done: false 
          }
          i++;
        }
        let task = {
          'habbitName':req.body.habbitName,
          'timeRemind': req.body.timeRemind,
          'Month': months,
          'habbitType': req.body.habbitType,
          'Description': req.body.habbitDescription
        }
        for(let day of days){
          if(req.body[day]){
            task[day]=true;
          }
        }
        let user = await User.findById(req.user.id);
        await user.tasks.push(task);
        await user.save();
      });
    res.redirect('back');
    }catch(err){
      console.log(err);
      res.redirect('back');
    }
}

var deleteTask = async function(req,res){
  try{
    let user = await User.findById(req.user.id);
    await user.tasks.pull(req.params.taskId);
    await user.save();
    res.status(200).json({
      code: 200
    });
  }catch(err){
    res.status(200).json({
      code: 404
    })
    return;
  }
}

var toggleTask = async function(req, res){
  try{
    let todayDate = new Date();
    let dateIndice = todayDate.getDate()-1;
    //console.log(dateIndice);
    let done  = true;
    if(req.params.boolVal == 'true'){
      done= false;
    }
    let doc = await User.findOneAndUpdate({
      _id: req.user.id,
      "tasks._id":req.params.taskId
    }
    ,{
      $set:{"tasks.$.Month.$[dateIndex].done": done }
    },{
      arrayFilters:[ {"dateIndex.date" : dateIndice}]
    }
    );
    //console.log(doc);
    
    //task.tasks[0].Month[dateIndice] = !task.tasks[0].Month[dateIndice];

    res.status(200).json({
      code: 200
    })
    return;
  }catch(err){
    res.status(200).json({
      code: 404
    })
    return;
  }
  
}

module.exports = {
    main,
    addHabbit,
    deleteTask,
    toggleTask,
    getTasks,
    servePhoto
}