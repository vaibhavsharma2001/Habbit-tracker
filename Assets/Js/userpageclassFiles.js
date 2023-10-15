class userPage{
    constructor(){
        this.initialize();
    }

    initialize(){
        $('#password-changePassword, #confirmpassword-changePassword').on('keyup',function(e){
            if($('#password-changePassword').val() == $('#confirmpassword-changePassword').val()){
                $('#isbothMatching').empty().append('<b style="color: green;">Passwords are matching.<b/>');
            }else{
                $('#isbothMatching').empty().append('<b style="color: red;">Passwords are not matching.<b/>');
            }
        });

        $('#changePassword').submit(function(e){
            e.preventDefault();
            $('#button-changePassword').attr('disabled',true);
            if($('#password-changePassword').val()=='' || $('#confirmpassword-changePassword').val()=='' || ($('#password-changePassword').val()!=$('#confirmpassword-changePassword').val())){
            
            }else{
                $.ajax({
                    url: '/users/changePassword-inside/'+$('#layout-main').attr('user_id'),
                    type: 'POST',
                    data: new FormData(this),
                    contentType: false,
                    processData:false,
                    cache: false,
                    success: function(response){
                        $('#button-changePassword').attr('disabled', false);
                        if(response.code==200){
                            alert('Password Changed...');
                        }else{
                            alert('Due to some errors password was not changed please try again..');
                        }                           
                    }
                })
            }
        })

        $('#photo-upload > input[type=file]').change(function(e){
            if(this.files && this.files[0]){
                var reader = new FileReader();
                    reader.onload = function(e) {
                        $('#user-photo > Img').attr('src',e.target.result);
                }
                reader.readAsDataURL(this.files[0]);
            }
        })

        $('#changePhoto').submit(function(e){
            e.preventDefault();
            var formData = new FormData();
            formData.append('profile-photo', $('#photo-upload > input[type=file]')[0].files[0]);
            $.ajax({
                url: '/users/change-photo/'+$('#layout-main').attr('user_id'),
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,  // tell jQuery not to set contentType
                success : function(response) {
                    if(response.code==200){
                        alert('Photo Changed...');
                    }else{
                        alert('Due to some errors photo was not changed please try again..');
                    } 
                        }
            })
        })
    }
}