
/* ------------------- imports node modules -------------------*/
const express    = require('express')
const _          = require('underline')
const bodyParser = require('body-parser')
const cassandra  = require('cassandra-driver');
const morgan     = require('morgan')

/* ------------------- imports local folder -------------------*/
const config         = require('./config')

/* ------------------- init variables -------------------*/
const client = new cassandra.Client(config.db_connect)
const app    = express()

app.use(bodyParser.json())
app.use(morgan('dev'))


// POST
// requires username and password
// returns user_id and token ?
// 
app.post('/login', (req, res) => {


})




app.listen(3000, () => console.log('server ready!'))

