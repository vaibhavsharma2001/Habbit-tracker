var getTasksHomePage = function(){
    $('.myTasks-content').append(`<div class="loadingScreen">
    <div class="b b1"></div>
    <div class="b b2"></div>
    <div class="b b3"></div>
    <div class="b b4"></div>
  </div>`);
    $.ajax({
        url: `./getasks`,
        type: "GET",
        success: function(response) {
            if(response.code==200 && response.tasks.length>0){
                $('.myTasks-content').empty();
                for(let task of response.tasks){
                    new initializetaskTile(task,response.dateIndex);
                }

                $('.taskTile').each(function(){
                    let self = this;
                    new taskTile(self);
                })
            }else{
                $('.myTasks-content').empty().append('<div class="taskTile"><div class="task-innerTile"><div class="myTasks-habbitArea"><div class="habbit-heading"><b>No Tasks to display</b></div></div></div></div>');
            }
        }
    });
}

var changePage = function(){
    var currentHash = location.hash;
    $('#home-page').addClass('hide-page');
    $('#calender-page').addClass('hide-page');
    $('#user-page').addClass('hide-page');
    $('#notifications-page').addClass('hide-page');
    if(currentHash == ''){
        $('#home-page').removeClass('hide-page');
        $('#myTasks-heading').find('button').on('click', function(){
            $('.myTasks-content').empty().toggleClass('display-grid');
            getTasksHomePage();
        })    
    }else if(currentHash=='#calender-page'){
        $('#calender-page').removeClass('hide-page');
        let user_id = $('#layout-main').attr('user_id');
        $('#calender-page').append(`<div class="loadingScreen">
        <div class="b b1"></div>
        <div class="b b2"></div>
        <div class="b b3"></div>
        <div class="b b4"></div>
      </div>`);
        $.ajax({
            url: `./calender/${user_id}`,
            type: "GET",
            success: function(response) {
                if(response.code==200){
                    $('#calender-page').empty();
                    $('#calender-page').append("<h1>Week's History</h1>");
                    for(let task of response.data[0].tasks){
                        new initializeweekTile(task);
                    }

                    $('.weektaskTile').each(function(){
                        let self = this;
                        new weekTaskTile(self);
                    });
                }
            }
         });
    }else if(currentHash=='#user-page'){
        $('#user-page').removeClass('hide-page');
        new userPage();
    }else if(currentHash == '#notifications-page'){
        $('#notifications-page').removeClass('hide-page');
    }
}
$(window).on('hashchange', function(){
    // On every hash change the render function is called with the new hash.
    // This is how the navigation of our app happens.
    changePage();
});
(function(){

    changePage();
    let self = new initiateNotifications();
    
})();




