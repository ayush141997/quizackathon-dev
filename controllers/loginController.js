const service =  require('../services/loginService') // import the login service

/* Entry function to show the login page
@Param req : request object
@Param res : response object
*/
const index = (req, res) => {
    if(req.session.userId){
        res.redirect('dashboard')
    }else{
        res.render('signIn')
    }
}

/* To show the register page
@Param req : request object
@Param res : response object
*/
const register = (req, res) => {
    if(req.session.userId){
        res.redirect('dashboard')
    }else{
        res.render('register')
    }
}

/* To enter the new user data into database
@Param req : request object
@Param res : response object
*/
const registerUser =async (req,res) => {
    const signInData = signInFormat(req.body)
    const result = await service.register(signInData)
    if(result){
        req.session.userId = result._id
        req.session.userName = result.name
        res.render('dashboard')
    }else{
        res.redirect('register?'+false)
    }
}

/* To validate the user and give access to dashboard
@Param req : request object
@Param res : response object
*/
const signIn = async (req,res) => {
    const signInData = signInFormat(req.body)
    const result = await service.signIn(signInData)
    if(result.auth){
        req.session.userId = result.id
        req.session.userName = result.name
        if(signInData.mode == 'normal'){
            res.redirect('dashboard')
        }else{
            res.send(true)
        }
    }
    else{
        if(signInData.mode == 'normal'){
            res.redirect('index?'+result.res)
        }else{
            res.send(false)
        }
    }
}

/* To show the dashboard page
@Param req : request object
@Param res : response object
*/
const dashboard = (req, res) => {
    if(req.session.userId){
        res.render('dashboard')
    }else {
        res.redirect('index')
    }
    
}

/* To format the sign in data according to database format
@Param signInData : data from the frontend

@return : formatted data
*/
function signInFormat(signInData) {
    const { uid, name, email, mode, password, ...rest } = signInData
    let newSignInData = Object.assign({}, { ...signInData })
    for (keys of Object.keys(rest)) {
        delete newSignInData[keys]
    }
    return newSignInData
}

/* To destroy the session and sign out the user
@Param req : request object
@Param res : response object
*/
const signOut = (req, res) => {
    req.session.destroy()
    res.redirect('index?logout')
}

/* To show the admin login page
@Param req : request object
@Param res : response object
*/
const admin = (req,res) => {
    if(req.session.adminId){
        res.redirect('adminDashboard')
    }else{
        res.render('adminLogin')
    }
}

/* To validate the admin
@Param req : request object
@Param res : response object
*/
const adminSignIn = (req,res) => {
    const email = req.body.email
    const password = req.body.password
    const result = service.adminSignIn(email,password)
    if(result){
        req.session.adminId = 'admin'
        res.redirect('adminDashboard')
    }else{
        res.redirect('admin?false')
    }
}

/* To sign out the admin
@Param req : request object
@Param res : response object
*/
const adminSignOut = (req, res) => {
    req.session.destroy()
    res.redirect('admin?logout')
}

/* To show the admin dashboard page
@Param req : request object
@Param res : response object
*/
const adminDashboard = (req,res) => {
    if(req.session.adminId){
        res.render('adminDashboard')
    }else{
        res.redirect('admin')
    }
    
}

module.exports = {
    index,
    signIn,
    dashboard,
    register,
    registerUser,
    signOut,
    admin,
    adminSignIn,
    adminDashboard,
    adminSignOut
}