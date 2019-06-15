const user = require('../models/loginModel').user
const bcrypt = require('bcrypt-nodejs')

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

class LoginService {

    async signIn(data) {
        if (data && data.mode == 'normal') {
            //fetch the data from the database using emailid
            let response = await user.findOne({ email: data.email })
            if (response.length == 0) {
                return { auth: false, res: 'ne' }
            }
            else {

                if (!(bcrypt.compareSync(data.password,response.password))) {
                    return { auth: false, res: 'false' }
                } else {
                    return { auth: true, id: response._id, name: response.name }
                }
            }
        }
        else if (data && data.mode == 'google') {
            //push the data into db
            let response = await user.find({ uid: data.uid })
            if (response.length == 0) {
                const newUser = user(data)
                await newUser.save()
            }
            return { auth: true, id: data.uid , name: data.name}
        }
        return { auth: false, res: "false" }
    }

    async register(data) {
        let response = await user.find({ email: data.email }, { password: 1 })
        if (response.length == 0) {
            const newUser = user(data)
            newUser.password = generateHash(data.password);
            await newUser.save()
            return true
        }
        return false
    }

    adminSignIn(email,password){
        if(email == "admin@quantiphi.com" && password == "admin123"){
            return true
        }else {
            return false
        }
    }
}

module.exports = new LoginService()