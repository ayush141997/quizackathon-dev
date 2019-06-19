// To validate the data entered
function check(){
    if(($('#password').val() === $('#cpassword').val()) && $('#password').val() !== '' && $('#name').val() !== ''
    && $('#email').val() !== '' && $('#cpassword').val() !== ''){
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