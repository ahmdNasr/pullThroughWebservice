
/* ------------------- imports node modules -------------------*/
const express    = require('express')
const _          = require('underline')
const bodyParser = require('body-parser')
const cassandra  = require('cassandra-driver');
const morgan     = require('morgan')

/* ------------------- imports local folder -------------------*/
const config         = require('./config')()

/* ------------------- init variables -------------------*/
const client = new cassandra.Client(config.db_connect)
const app    = express()



const apiRouter      = require('./routes/index')(client)

app.use(bodyParser.json())
app.use(morgan('dev'))

app.use(apiRouter)

// connect client and listen to port 3000
client.connect((err) => {
	if (err) {
		client.shutdown();
		console.error('There was an error when connecting', err);
	}
	console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());


	// now that db is ready listen to the port
	app.listen(3000, () => console.log('server ready!'))
});

process.on('exit', () => client.shutdown());
