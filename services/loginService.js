const user = require('../models/loginModel').user
const bcrypt = require('bcrypt-nodejs')

/* Generate hash for the password
@Param password : password in string format

@return : hashed password
*/
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

class LoginService {

    /* To get data from the  database and validate the user 
    @Param data : formatted data from the controller

    @return (Object):
        auth : Boolean for authorization
        res : response string for frontend
        id : user id
        name : user name
    */
    async signIn(data) {
        if (data && data.mode == 'normal') {
            //fetch the data from the database using emailid
            let response = await user.findOne({ email: data.email })
            if (!response) {
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
            if (!response) {
                const newUser = user(data)
                await newUser.save()
            }
            return { auth: true, id: data.uid , name: data.name}
        }
        return { auth: false, res: "false" }
    }

    /* To register data into database
    @Param data : formatted data from the controller

    @return result | false :
                        result : inserted record of user
    */
    async register(data) {
        let response = await user.find({ email: data.email }, { password: 1 })
        if (response.length == 0) {
            const newUser = user(data)
            newUser.password = generateHash(data.password);
            const result = await newUser.save()
            return result
        }
        return false
    }

    /* To validate admin sign in
    @Param email : entered email of the admin
    @Param password : entered password of admin

    @return (Boolean) : authorization
    */
    adminSignIn(email,password){
        if(email == "admin@quantiphi.com" && 
        bcrypt.compareSync(password,'$2a$08$uStPk.jjPWpYqTQ1per6Ye/gl7ePQvPz3IzuqZhyQ7lPyFcvLIu4q')){
            return true
        }else {
            return false
        }
    }
}

module.exports = new LoginService()