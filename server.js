
/* ------------------- imports node modules -------------------*/
const fs         = require('fs')
const https      = require('https')
const express    = require('express')
const _          = require('underline')
const bodyParser = require('body-parser')
const cassandra  = require('cassandra-driver');
const morgan     = require('morgan')
const readJson   = require('read-json')

/* ------------------- imports local folder -------------------*/
//const accesspatterns = require('./accesspatterns')
const config         = require('./domain/helpers/config.js')
const api 			 = require('./domain/api.js')

/* ------------------- certificates ------------------- */
const isProd = process.env.NODE_ENV === "prod"
const privateKeyPath = isProd ? "/etc/letsencrypt/live/alexandermuellner2.customers.typoheads.net-0003/privkey.pem" : "./key.pem"
const certificatePath = isProd ? "/etc/letsencrypt/live/alexandermuellner2.customers.typoheads.net-0003/cert.pem" : "./server.crt"
const fullchain1Path = isProd ? "/etc/letsencrypt/live/alexandermuellner2.customers.typoheads.net-0003/fullchain1.pem" : "./chain.crt"
const fullchain2Path = isProd ? "/etc/letsencrypt/live/alexandermuellner2.customers.typoheads.net-0003/fullchain2.pem" : "./chain.crt"

const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
const certificate = fs.readFileSync(certificatePath, 'utf8')
const fullchain1 = fs.readFileSync(fullchain1Path, 'utf8')
const fullchain2 = fs.readFileSync(fullchain2Path, 'utf8')

const credentials = { key: privateKey, cert: certificate, ca: [
            fullchain1, 
            fullchain2
        ] }
//const credentials = { key: privateKey, cert: certificate, chain: chain }

/* ------------------- init variables -------------------*/
const client = new cassandra.Client(config.db_connect)
const app    = express()

const httpsServer = https.createServer(credentials, app)

/* ------------------- logging ------------------- */
const loggerFactory = require('./domain/helpers/logger.js')
const apiFatalLogger = loggerFactory("FATAL")

/* ------------------- app config ------------------- */
app.use(bodyParser.json())
app.use(morgan('dev'))


/* iterate over accesspatterns and create the routes with appropiate db queries and param checks -> after that listen to port */

function setup(accesspatterns){
	var setupDefered = Promise.defer()
	var allRouterGenerated = []

	accesspatterns.forEach( (pattern) => {

		if(pattern.method) 
			allRouterGenerated.push(api.generateRouter(pattern, client))
		else 
			return setupDefered.reject(new Error(`Pattern (${pattern.name}) doesn't have a valid method definition!`))		
		
	})

	// when all Promises are resolved which means alss 
	Promise.all(allRouterGenerated)
	.then( (routers) => {
		app.use('/api', routers) 
		setupDefered.resolve()	
	})
	.catch( (error) => {
		console.log(error)
	}) /*log somehow*/

	
	return setupDefered.promise
}

function postSetup(){
	/* error handling */
	app.use( (req, res) => {

		res.setHeader('Content-Type', 'text/plain')

		res.write('\nreq params:\n')
		res.write(JSON.stringify(req.params, null, 2))


		res.write('\nPOST body:\n')
		res.write(JSON.stringify(req.body, null, 2))

		res.end()
	})
	
	client.connect((err) => {
		if (err) {
			client.shutdown();
			console.error('There was an error when connecting', err);
		}
		console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());


		// now that db is ready listen to the port
		httpsServer.listen(8080, () => console.log('https server ready on port 8080!'))
	})


}

function importAccesspatterns(){
	var importDefered = Promise.defer()

	readJson('./domain/helpers/accesspatterns.json', (err, accesspatterns) => {
		err 
		? importDefered.reject(err)
		: importDefered.resolve(accesspatterns)
	})

	return importDefered.promise
}

importAccesspatterns()
.then(setup)
.then(postSetup)
.catch((error) => {
	apiFatalLogger.fatal(`Generation of Routes Failed: ${error}`)
})