
/* ------------------- imports node modules -------------------*/
const express    = require('express')
const underline  = require('underline')
const bodyParser = require('body-parser')
const cassandra  = require('cassandra-driver');
const morgan     = require('morgan')


/* ------------------- imports local folder -------------------*/
const accesspatterns = require('./accesspatterns')
const config         = require('./config')


/* ------------------- init variables -------------------*/
const client = new cassandra.Client(config.db_connect)
const app    = express()

app.use(bodyParser.json())
app.use(morgan('dev'))






app.use( (req, res) => {

	res.setHeader('Content-Type', 'text/plain')

	res.write('\nreq params:\n')
	res.write(JSON.stringify(req.params, null, 2))


	res.write('\nPOST body:\n')
	res.write(JSON.stringify(req.body, null, 2))

	res.end()
})


app.listen(3000, () => console.log('server ready!'))

