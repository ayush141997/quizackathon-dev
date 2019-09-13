/* For google sign in */
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    $.ajax({
        url: 'signIn',
        method: 'post',
        data: {
            uid: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail(),
            mode: 'google'
        },
        success: (res) => {
            console.log(res)
            if (res) {
                window.location.href = "quiz"
            }
        }
    })
}

/* To instantiate the google auth api */
function onLoad() {
    console.log('ran')
    gapi.load('auth2', function () {
        gapi.auth2.init();
    });
}

/* For google sign out */
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location.href = "/signOut"
    });

}

$(document).ready(() => {
    if(window.location.href.endsWith('false')){
        toastr["error"]("Incorrect Credentials Entered")
    }
    if(window.location.href.endsWith('ne')){
        toastr["error"]("User doesn't Exist")
    }
    if(window.location.href.endsWith('logout')){
        toastr["success"]("Logged Out Successfully")
    }
})