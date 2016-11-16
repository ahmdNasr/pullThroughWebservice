
/* ------------------- imports node modules -------------------*/
const express    = require('express')
const _          = require('underline')
const bodyParser = require('body-parser')
const cassandra  = require('cassandra-driver');
const morgan     = require('morgan')


/* ------------------- imports local folder -------------------*/
const accesspatterns = require('./accesspatterns')
const config         = require('./config')
const handler        = require('./apiHandler.js') 

/* ------------------- init variables -------------------*/
const client = new cassandra.Client(config.db_connect)
const app    = express()

app.use(bodyParser.json())
app.use(morgan('dev'))


/* iterate over accesspatterns and create the routes with appropiate db queries and param checks -> after that listen to port */

function setup(){

	var setupDefered = Promise.defer();

	accesspatterns.forEach((pattern) => {
		
		// add accesspattern.name to the app
		const patternname = `/${pattern.name}`
		switch(pattern.method){
			case 'GET': 
				app.get(patternname, handler(pattern)['get'])
				break
			case 'def':
				app.post(patternname, handler.post)
				break
			case 'POST':
				app.put(patternname, handler.put)
				break
			case 'POST':
				app.delete(patternname, handler.delete)
				break
			default:
				setupDefered.reject(new Error(`Pattern (${pattern.name}) doesn't have a valid method definition!`))
		}

	})

	// resolve promise if everythin was alright
	setupDefered.resolve()
	return setupDefered.promise
}

setup()
.then(() => {

	app.use( (req, res) => {

		res.setHeader('Content-Type', 'text/plain')

		res.write('\nreq params:\n')
		res.write(JSON.stringify(req.params, null, 2))


		res.write('\nPOST body:\n')
		res.write(JSON.stringify(req.body, null, 2))

		res.end()
	})


	app.listen(3000, () => console.log('server ready!'))

})
.catch(console.log)

