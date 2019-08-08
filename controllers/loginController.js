const service =  require('../services/loginService')

const index = (req, res) => {
    if(req.session.userId){
        res.redirect('dashboard')
    }else{
        res.render('signIn')
    }
}

const register = (req, res) => {
    if(req.session.userId){
        res.redirect('dashboard')
    }else{
        res.render('register')
    }
}

const registerUser = async (req,res) => {
    const signInData = signInFormat(req.body)
    const result = await service.register(signInData)
    if(result){
        req.session.userId = result.id
        res.render('dashboard')
    }else{
        res.redirect('register?'+false)
    }
}

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

const dashboard = (req, res) => {
    if(req.session.userId){
        console.log(req.session.userName)
        res.render('dashboard')
    }else {
        res.redirect('index')
    }
    
}

function signInFormat(signInData) {
    const { uid, name, email, mode, password, ...rest } = signInData
    let newSignInData = Object.assign({}, { ...signInData })
    for (keys of Object.keys(rest)) {
        delete newSignInData[keys]
    }
    return newSignInData
}

const signOut = (req, res) => {
    req.session.destroy()
    res.redirect('index?logout')
}

const admin = (req,res) => {
    res.render('adminLogin')
}

const adminSignIn = (req,res) => {
    const email = req.body.email
    const password = req.body.password
    const result = service.adminSignIn(email,password)
    if(result){
        res.redirect('adminDashboard')
    }else{
        res.redirect('admin?false')
    }
}

const adminDashboard = (req,res) => {
    res.render('adminDashboard')
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
    adminDashboard
}