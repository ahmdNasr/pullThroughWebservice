const db = require('../db')

var testClient = { 
	execute: (cql, params, cb) => {
		
		/* ... do some stuff with cql and params ... */
		/*
		console.log(cql)
		console.log(params)
		*/

		/* uncomment one of the returns */
		return cb({error: "some db error"}, null)
		// return cb(null, { rowLength: 2, rows: [ "worked"] })
	}
}

db.executeCQL(testClient, "select ...", ['param1'])
.then(console.log)
.catch(console.log)
