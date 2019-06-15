function check(){
    if($('#password').val() === $('#cpassword').val()){
        $('#regSubmit').removeAttr('disabled')
    }else{
        $('#regSubmit').attr('disabled','true')
    }
}

$(document).ready(() => {
    if(window.location.href.endsWith('false')){
        toastr["error"]("User already exists or Something went wrong")
    }
})