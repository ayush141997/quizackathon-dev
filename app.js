const express = require('express')
const app =  express()
const bodyParser = require('body-parser')
const session = require('express-session')
const config = require('./config.json')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.static(__dirname + '/views'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(session({secret : 'hack the secret'}))
require('./routes')(app)

let port = process.env.PORT || config.port
app.listen(port ,() => {
    console.log("Express Server Up and Running on " + port)
})

process.on('unhandledRejection', (err) => {
    console.error(err)
});
