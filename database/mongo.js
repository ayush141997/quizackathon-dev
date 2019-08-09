const mongoose = require('mongoose')
const config = require('../config.json') // To get the config

const dbHost = config.dbConfig.host // database host
const dbOptions = config.dbConfig.options // options for connecting to the database

/* Connection to the database */
mongoose.connect(dbHost,dbOptions,(err) => {
    if(err){
        console.log("Error in connecting " + err)
    }
})

/* Events handled for debugging */
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