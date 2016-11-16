const api = require('../domain/api.js')
const express = require('express')
const bodyParser = require('body-parser')

const accesspattern ={
		name: "login",
		method: "POST",
		params: ["email", "password"],
		queries: ["SELECT user_id FROM users_login WHERE email = ? AND password = ?"],
		description: "User login with basic authentication"
	}


const testClient = { 
	execute: (cql, params, cb) => {
		
		/* ... do some stuff with cql and params ... */
		/*
		console.log(cql)
		console.log(params)
		*/

		/* uncomment one of the returns */
		//return cb({error: "some db error"}, null)
		 return cb(null, { rowLength: 2, rows: [ "worked"] })
	}
}

api
.generateRouter(accesspattern, testClient)
.then((router) => {

	var app = express()
	
	app.use(bodyParser.json())
	app.use(router)
	
	app.listen(3000, () => console.log('Server Ready'))

})
.catch(console.log)

