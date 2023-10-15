class weekTaskTile{
    constructor(taskTile){
        this.taskTile = taskTile;
        this.initialize();
    }

    initialize(){
        let self = this;

        $(self.taskTile).find('.showMonthstats button').on('click', function(){
            $(self.taskTile).find('.monthHistory').toggleClass('display-grid');
            self.showMonthHistory();
        })

        $(self.taskTile).find('.daytaskTiles .habbit-status').each(function(){
            let selfer = this;
            $(selfer).on('click', function(){
                $.ajax({
                    url: $(this).attr('toggle_task')+$(this).attr('done'),
                    type: "GET",
                    success: function(response) {
                        if(response.code==200){
                            if(response.done == false){
                                $(selfer).find('i').addClass('fa-regular black-icon');
                                $(selfer).find('i').removeClass('fa-solid red-icon ');
                                $(selfer).attr('done', 'false');
                            }else{
                                $(selfer).find('i').removeClass('fa-regular black-icon');
                                $(selfer).find('i').addClass('fa-solid red-icon ');
                                $(selfer).attr('done', 'true');
                            }
                            self.showMonthHistory();
                        }
                    }
                 })
            })
        })

    }

    showMonthHistory(){
        let self = this;
        let user_id = $('#layout-main').attr('user_id');
        let taskId = $(self.taskTile).attr('id');
        $(self.taskTile).find('.monthGrid').empty().append(`<div class="loadingScreen">
        <div class="b b1"></div>
        <div class="b b2"></div>
        <div class="b b3"></div>
        <div class="b b4"></div>
      </div>`);
      $(self.taskTile).find('.successChart').empty().append(`<div class="loadingScreen">
      <div class="b b1"></div>
      <div class="b b2"></div>
      <div class="b b3"></div>
      <div class="b b4"></div>
    </div>`);
    $(self.taskTile).find('.monthTab').empty().append(`<div class="loadingScreen">
    <div class="b b1"></div>
    <div class="b b2"></div>
    <div class="b b3"></div>
    <div class="b b4"></div>
  </div>`);
        $.ajax({
            url: `./calender/show-month-history/${user_id}/${taskId}`,
            type: "GET",
            success: function(response) {
                if(response.code==200){
                    if(response.data[0]){
                    self.fillMonthGrid(response.data[0].tasks);
                    self.fillMonthtab(response.data[0].tasks.habbitName,response.data[0].tasks.Description,response.data[0].tasks.habbitType);
                    }
                }
            }
         });
    }

    fillMonthGrid(task){
        let self =this;
        let today = new Date();

        let month = today.getMonth()+1;
        let year = today.getFullYear();
        $(self.taskTile).find('.monthGrid').empty().append('<h4>Activity for whole Month:</h4>');
        if(month==12){
            month =0;
            year= year+1;
        }
        let totalDays = new Date(year, month,0).getDate();
        let c=0;
        let innerGrid = $(`<div class='inner-grid'></div>`);
        let nume=0;
        let deno=0;
        for(let i=0; i<5&&c<totalDays; i++){
            let weekGrid= $(`<div class='week'></div>`);
            for(let j =0;j<7&&c<totalDays; j++){
                let dayBox =0;
                let day = new Date(year,month-1,i*7+j+1).getDay();
                if(task.days[day].v){
                    if(task.Month[i*7+j].done ){
                        dayBox=$(`<div class='daySquare' style="background: #f28c3c"></div>`); 
                        if((i*7+j)<today.getDate()){
                            nume++;
                        }
                    }else{
                        dayBox=$(`<div class='daySquare' ></div>`);
                    }
                    if((i*7+j)<today.getDate()){
                        deno++;
                    }
                }else{
                    dayBox=$(`<div class='daySquare' style="background: grey"></div>`);
                }
                c++;
                weekGrid.append(dayBox);
            }
            innerGrid.append(weekGrid);
        }
        $(self.taskTile).find('.monthGrid').append(innerGrid);
        self.printChart(nume,deno);   
    }

    fillMonthtab(habbitName,Description,habbitType){
        let self = this;
        let myArray = habbitName.split(" ");
        myArray.push(...Description.split(" "));
        let searchString = myArray.join("+");
        if(habbitType == 'Work'){
            searchString = 'how+to+'+searchString;
        }else{
            searchString = 'health+facts+about+'+searchString;
        }
        $.ajax({
            url: `/calender/getSuggestions/${searchString}`,
            type: "GET",
            success: function(response){
                $(self.taskTile).find('.monthTab').empty().append(`<h4>Some search results you might like:</h4>
                <ul>
                </ul>`);
                if(response.code==200){
                    for(let result of response.results){
                        let listItem = $(`<li><a href="${result.link}">${result.htmlTitle}</li>`);
                        $(self.taskTile).find('.monthTab ul').append(listItem);
                    }
                }
            }
        });    


    }

    printChart(nume,deno){
       let self = this; 
       let  success = (nume/deno)*100;
       let pieChart =  $(`    <div class="my-pie-chart" style="
       background: conic-gradient(#f28c3c 0% ${success}%,#277BC0 ${success}% 100%);"></div>
        <p><span style="color: #f28c3c">Success</span> 
            <span style="color: #277BC0">Fail</span></p>
    `);
    $(self.taskTile).find('.successChart').empty().append(pieChart);
    }
}

class initializeweekTile{
    constructor(task){
        this.task = task;
        this.initialize();
    }

    initialize(){
        let self = this;
        var userId = $('#layout-main').attr('user_id')
        var newTask = $(`<div id=${self.task._id} user_id=${userId} class="weektaskTile">
        <h3>${self.task.habbitName}</h3>
        <div class ="daytaskTiles">
            
        </div>
        <div class="showMonthstats">
            <button>Show month history</button>
        </div>
        <div class="monthHistory">   
            <div class="monthGrid">
                <h4>Activity for whole Month:</h4>
            </div>
            <div class="successChart">
                <h4>Success/Fail:</h4>
            </div>
            <div class="monthTab">
                <h4>Some search results you might like:</h4>
                <ul>
                </ul>
            </div>

        </div>
    </div>`);
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', "Friday", 'Saturday'];
        
        for(let i=0; i<self.task.Month.length; i++){
            let dateString = `${new Date().getMonth()+1}/${self.task.Month[i].date+1}/${new Date().getFullYear()}`;
            let day = days[new Date(dateString).getDay()];
            let newDay = 0;
            if(self.task.Days[i].v){
            newDay = $(`
            <div id=${self.task._id} user_id=${userId} dateIndex=${self.task.Month[i].date} class="daytaskTile">
                <div class="habbit-status" done=${self.task.Month[i].done} toggle_task="/calender/toggle-task/${userId}/${self.task._id}/${self.task.Month[i].date}/">
                   ${self.task.Month[i].done ? '<i class="fa-solid fa-heart fa-3x red-icon"></i>' : '<i class="fa-regular fa-heart fa-3x black-icon"></i>'}
                </div>
                <div class="dayName">${day}</div>
            </div>`);
            }else{
                newDay = $(`
                <div id=${self.task._id} user_id=${userId}  class="daytaskTile">
                <div class="habbit-status" style="pointer-events: none;">
                <i class="fa-solid fa-xmark fa-3x black-icon"></i>
                </div>
                <div class="dayName">${days[i]}</div>
                </div>`);
                
            }
            newTask.find('.daytaskTiles').append(newDay);
        }
        for(let i=self.task.Month.length; i<7; i++){
            let newDay = $(`
            <div id=${self.task._id} user_id=${userId}  class="daytaskTile">
                <div class="habbit-status" style="pointer-events: none;">
                <i class="fa-solid fa-xmark fa-3x black-icon"></i>
                </div>
                <div class="dayName">${days[i]}</div>
            </div>`);
            newTask.find('.daytaskTiles').append(newDay);
        }
        $('#calender-page').append(newTask);
    }
}