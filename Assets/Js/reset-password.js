$(document).ready(function() {
    $("#resetPasswordForm").on('submit', (function(e) {
      e.preventDefault();
      $.ajax({
        url: $(this).attr('action'),
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function(response) {
           if(response.code==200){
            $('#loginForm').hide();
            $('#passwordresetSuccess').show();
           }else{
            $('#loginForm').hide();
            $('#passwordresetFailure').show();
           }
        }
     });
    }));
});