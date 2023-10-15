let body = $('body');
let home  = $('#icon-1');
let calender = $('#icon-2');
let person = $('#icon-3');
let bell = $('#icon-4');

var currentHash = location.hash;
    if(currentHash == ''){
        home.addClass('animator-1');
    }else if(currentHash=='#calender-page'){
        calender.addClass('animator-2');
    }else if(currentHash=='#user-page'){
        person.addClass('animator-3');
    }else if(currentHash == '#notifications-page'){
        bell.addClass('animator-4');
    }

home.on('click',function(){
    home.addClass('animator-1');
    calender.removeClass('animator-2');
    person.removeClass('animator-3');
    bell.removeClass('animator-4');
    location.hash = '';
});

calender.on('click',function(){
    home.removeClass('animator-1');
    calender.addClass('animator-2');
    person.removeClass('animator-3');
    bell.removeClass('animator-4');
    location.hash = 'calender-page'
});

person.on('click',function(){
    home.removeClass('animator-1');
    calender.removeClass('animator-2');
    person.addClass('animator-3');
    bell.removeClass('animator-4');
    location.hash = 'user-page'
});

bell.on('click',function(){
    
    home.removeClass('animator-1');
    calender.removeClass('animator-2');
    person.removeClass('animator-3');
    bell.addClass('animator-4');
    location.hash = 'notifications-page';
});
