
/* ------------------- imports node modules -------------------*/
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
console.log(config)
/* ------------------- init variables -------------------*/
const client = new cassandra.Client(config.db_connect)
const app    = express()

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
	.then( (routers) => routers.forEach((router) => app.use('/api', router)) )
	.catch( (error) => console.log(error) /*log somehow*/)


	// resolve promise if everythin was alright
	setupDefered.resolve()
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
		app.listen(3000, () => console.log('server ready!'))
	})


}

readJson('./domain/helpers/accesspatterns.json', (err, accesspatterns) => {

	setup(accesspatterns)
	.then(postSetup)
	.catch(console.log)

})