
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
	const username = req.body.username
	const password = req.body.password

	const passwordHash = "";
	

	client.execute('SELECT user_id, firstname, lastname, profile_picture, username FROM user_by_email_and_password WHERE email= ? AND password = ?;', [username, password], function (err, result) {
		if(err){
			return res.status(500).send({ error: 'Database error!' })
		}

		var user = result.rows[0];
		
		res.json(user);
		res.end();
	});
})


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