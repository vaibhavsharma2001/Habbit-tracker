$('#openSignUp').on('click', function(e){
    e.preventDefault();
    $('#loginForm').hide();
    $('#signForm').show();
    $('#verificationForm').hide();
    $('h1').text('Sign Up...');
})

$('#openLogin').on('click',function(e){
    e.preventDefault();
    $('#loginForm').show();
    $('#signForm').hide();
    $('#verificationForm').hide();
    $('h1').text('Log In...');
})

$('#openLoginagain').on('click',function(e){
    e.preventDefault();
    $('#loginForm').show();
    $('#signForm').hide();
    $('#verificationForm').hide();
    $('h1').text('Log In...');
})

$('#openVerification').on('click',function(e){
    e.preventDefault();
    $('#loginForm').hide();
    $('#signForm').hide();
    $('#verificationForm').show();
    $('h1').text('Forgot Password...');

    
    $('#verifyForm').show();
    $('#linksendFailure404').hide();
    $('#openLoginagain').show();
    $('#openverifyAgain').hide();
    $('#linksendFailure500').hide();
    $('#linksendSuccess').hide();
});

$('#openverifyAgain').on('click',function(e){
    e.preventDefault();
    
    $('#loginForm').hide();
    $('#signForm').hide();
    $('#verificationForm').show();
    $('h1').text('Forgot Password...');

    
    $('#verifyForm').show();
    $('#linksendFailure404').hide();
    $('#openLoginagain').show();
    $('#openverifyAgain').hide();
    $('#linksendFailure500').hide();
    $('#linksendSuccess').hide();
});


$(document).ready(function() {
    if($('#error-message').text().length!=0){
        $('#error-message').css('display', 'block');
    }
    $("#forgotForm").on('submit', (function(e) {
      e.preventDefault();
      $('#verfication').attr('disabled',true);
      $.ajax({
        url: $(this).attr('action'),
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function(response) {
            $('#verfication').attr('disabled',false);
           if(response.code==200){
            $('#verifyForm').hide();
            $('#linksendSuccess').show();
           }else if(response.code==404){
            $('#verifyForm').hide();
            $('#linksendFailure404').show();
            $('#openLoginagain').hide();
            $('#openverifyAgain').show();
           }else{
            $('#verifyForm').hide();
            $('#linksendFailure500').show();
           }
        }
     });
    }));
  });

$('#signform1Example23 , #form1Example33').on('keyup',function(e){
    if($('#signform1Example23').val()== $('#form1Example33').val()){
        $('#isMatching').html('<b>Password are matching</b>');
        $('#isMatching').css('color','green');    
    }else{
        $('#isMatching').html('<b>Password are not matching</b>');
        $('#isMatching').css('color','red');
        
    }
})


$('#loginSection').submit(function(e){
    if($('#form1Example13').val()=='' || $('#form1Example23').val()=='' || grecaptcha.getResponse(0).length==0){
        e.preventDefault();
    }else{
        $('#loginFromSubmit').attr('disabled',true);
    }
    
    
})


$('#signinSection').submit(function(e){
    if($('#signform1Example13').val()=='' || $('#form1Example03').val()=='' || grecaptcha.getResponse(1).length==0 ||($('#signform1Example23').val()!= $('#form1Example33').val())){
        e.preventDefault();
    }else{
        $('#signFormSubmit').attr('disabled',true);
    }
})
