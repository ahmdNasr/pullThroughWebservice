const logic = require('../logic')

var testDbClient = { 
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

var testRequest = {
	body: {
		email: "ahmed@example.com",
		password: "abcd"
	}
}

var accesspattern = {
	queries: ["select...."],
	params: ["email", "password"] // will be searched for in the request body
}

logic.stdSelect(testRequest, accesspattern,testDbClient).then(console.log).catch(console.log)