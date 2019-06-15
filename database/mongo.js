const mongoose = require('mongoose')
const config = require('../config.json')

const dbHost = config.dbConfig.host
const dbOptions = config.dbConfig.options

mongoose.connect(dbHost,dbOptions,(err) => {
    if(err){
        console.log("Error in connecting " + err)
    }
})

mongoose.connection.on('connected',() => {
    console.log("Mongoose connected")
})

mongoose.connection.on('disconnected',(err) => {
    console.log("Mongoose disconnected")
})

mongoose.connection.on('reconnectFailed',(err) => {
    console.log("Mongoose failed to reconnect " + err)
})

mongoose.connection.on('error', (err) => {
    console.log("Error occured " + err)
});

module.exports = {
    mongoose
}