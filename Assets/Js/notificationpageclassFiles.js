class initiateNotifications{
    constructor(){
        this.initialize();
    }

    initialize(){
        let markTime  = new Date(Date.now()).setHours(0,0,0);
        let obj = localStorage.getItem('notifications');
        if(obj){
        let newObj={};
        obj = JSON.parse(obj);
        for(let key of Object.keys(obj)){
            if(obj[key].clearTime>markTime){
                newObj[key]=obj[key];
            }
            localStorage.setItem('notifications',JSON.stringify(newObj));
        }
        }else{
            let newObj={};
            localStorage.setItem('notifications',JSON.stringify(newObj));
        }
        $.ajax({
            url: '/notifications/getTasks',
            type:'GET',
            success: function(response){
                for(let task of response.data[0].tasks){
                    new initiateNotification(task);
                }
            }
        })
    }
}

class initiateNotification{
    constructor(task){
        this.task = task;
        this.initialize();
    }

    initialize(){
        let self= this;
        let [hours,minutes] = self.task.timeRemind.split(':');
        let task = self.task;
        let currentTime = new Date().getTime();
        let futureTime = new Date(Date.now()).setHours(hours,minutes,0);
        let diffTimes = futureTime-currentTime;
        diffTimes = diffTimes>0 ? diffTimes : 0;
        setTimeout(function(){
            self.createNotification(task);
        },diffTimes);
    }

    createNotification(task){
        let obj = localStorage.getItem('notifications');
        if(obj){
            obj = JSON.parse(obj);
        }
        if(obj[task._id]){
            return;
        }
        $('#noNotifications').remove();
        alert('You have a notifications check your notifications');
        $('#notificationsBody').append(`<div class="card" id=${task._id} style="max-width:800px; margin: 20px;">
        <div class="card-header" style="background: #28a745; color: white; font-weight: bold;">
          ${task.habbitName}
        </div>
        <div class="card-body">
          <h3 class="card-title">You need to : ${task.habbitName} at ${task.timeRemind}</h3>
          <p class="card-text">${task.description}</p>
          <button href="#" class="btn btn-success">Clear It now</button>
        </div>
      </div>`);
       $(`#${task._id}`).find('button').on('click',function(e){
           $(`#${task._id}`).remove();
           let obj = localStorage.getItem('notifications');
           if(obj){
            obj = JSON.parse(obj);
           }
           let id = String(task._id); 
           obj[id]={
                clearTime : new Date().getTime()
           }
           localStorage.setItem('notifications',JSON.stringify(obj));
       })
    }

}