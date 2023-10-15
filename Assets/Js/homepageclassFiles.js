class taskTile{
    constructor(tasktile){
        this.tasktile = tasktile;
        this.doneButton = $(this.tasktile).find('.habbit-status');
        this.deleteButton = $(this.tasktile).find('.habbit-delete');
        this.pushListener();
        this.hoverListener();
        this.deleteListener();
    }
    hoverListener(){
        let self = this;
        $(self.deleteButton).mouseenter(function(){
            $(self.deleteButton).find('i').addClass('fa-solid');
            $(self.deleteButton).find('i').removeClass('fa-regular');
        }).mouseleave(function(){
            $(self.deleteButton).find('i').removeClass('fa-solid');
            $(self.deleteButton).find('i').addClass('fa-regular');
        })
    }

    deleteListener(){
        let self = this;
        $(self.deleteButton).on('click', function(){
            $.ajax({
                url: $(self.deleteButton).attr('delete'),
                type: "GET",
                success: function(response) {
                    if(response.code==200){
                        $('#'+$(self.deleteButton).attr('taskid')).remove();
                    }
                }
             });
        });
    }
    pushListener(){
        let self = this;
        $(this.doneButton).on('click',function(){
            let selfer = this;
            let doneTag = $(selfer).closest('.taskTile');
            let buttonText = $(selfer).siblings('.status-text')
            if($(doneTag).attr('done')=='true'){
                $.ajax({
                    url: $(self.doneButton).attr('toggleTask'),
                    type: "GET",
                    success: function(response) {
                        if(response.code==200){             
                            $(selfer).find('i').addClass('fa-regular black-icon');
                            $(selfer).find('i').removeClass('fa-solid red-icon ');
                            $(buttonText).html('Not Done');
                            $(doneTag).attr('done','false');
                        }
                    }
                 });
            }else{
                $.ajax({
                    url: $(self.doneButton).attr('toggleTask'),
                    type: "GET",
                    success: function(response) {
                        if(response.code==200){             
                            $(selfer).find('i').removeClass('fa-regular black-icon');
                            $(selfer).find('i').addClass('fa-solid red-icon ');
                            $(buttonText).html('Done');
                            $(doneTag).attr('done','true');
                        }
                    }
                 });
            }
        })
    }
}

class initializetaskTile{

    constructor(taskData,dateIndex){
        this.taskData = taskData;
        this.dateIndex = dateIndex;
        this.initialize();
    }

    initialize(){
        let self = this;
        let user_id = $('#layout-main').attr('user_id');
        let newTask = $(`<div id="${self.taskData._id}" user_id="${user_id}" done=${self.taskData.Month[self.dateIndex].done}  class="taskTile">
        <div class="task-innerTile">
            <div class="myTasks-habbitArea">

                <div class="habbit-heading"><b>
                ${self.taskData.habbitName.length<=30 ? self.taskData.habbitName : self.taskData.habbitName.substring(0, 30)}</b></div>
                <div class="habbit-status" toggleTask = "/toggle-task/${self.taskData._id}/${self.taskData.Month[self.dateIndex].done}">
                ${self.taskData.Month[self.dateIndex].done ? '<i class="fa-solid fa-heart fa-3x red-icon"></i>': '<i class="fa-regular fa-heart fa-3x black-icon"></i>'}
                </div>
                <div class="habbit-delete" taskid ="${self.taskData._id}" delete="/delete/${self.taskData._id}">
                    <i class="fa-regular fa-trash-can fa-2x black-icon"></i>
                </div>
                <div class="habbit-description">
                ${self.taskData.Description.length<=60 ? self.taskData.Description : self.taskData.Description.substring(0, 30)}</b></div>
                <div class="status-text">
                    ${self.taskData.Month[self.dateIndex].done ? 'Done' : 'Not Done'}
                </div>
            </div>
        </div>
    </div>`);
       $('.myTasks-content').append(newTask);
    }
}
