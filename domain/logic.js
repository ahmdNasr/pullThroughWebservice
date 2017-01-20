'use strict'
const db = require('./db')
const jwt = require('jsonwebtoken')


// extracts the params from the request object in right order
var extractParamsFromRequest = function(paramNames, req){
	let paramsDefered = Promise.defer()
	let params = []

	paramNames.forEach( (paramName) => {
		let paramValue = req.body[paramName] ? req.body[paramName] : paramsDefered.reject(new Error(`Parameter ${paramName} not found in request object.`))
		params.push(paramValue)
	})

	paramsDefered.resolve(params)
	return paramsDefered.promise
}

var basicAuthenticate = function(inputEmail, inputPasswort, db){
	
}

var stdSelect = function(request, accesspattern, dbclient){
	let selectDefered = Promise.defer()

	let cql = accesspattern.query || accesspattern.queries[0]
	
	extractParamsFromRequest(accesspattern.params, request).then( (params) => {
	
		db.executeCQL(dbclient, cql, params)
		  .then(selectDefered.resolve)
		  .catch(selectDefered.reject)
	}).catch(selectDefered.reject)
	
	return selectDefered.promise
}

var loginJWT =  function(req, accesspattern, dbclient){
	let loginDefered = Promise.defer()

	let slectCql = accesspattern.queries[0] // Select user_id....
	
	const authenticate = (dbResult) => {
		let authDefered = Promise.defer()
		
		req.body.email, req.body[password], dbResult.email, dbResult.password

			if(req.body.email == req.body[password] && dbResult.email == dbResult.password){

			let token = jwt.sign(user, config.jwtSecret, {
				expiresInMinutes: 1440 // expires in 24 hours
			})

			authDefered.resolve({
				success: true,
				message: 'Enjoy your token!',
				token: token
			})

		}
		return authDefered.promise
	}
	
	stdSelect(req, accesspattern, dbclient)
			.then(authenticate) // authenticate resolves token token with user data
			.then(selectDefered.resolve)
			.catch(selectDefered.reject)


	return loginDefered.promise
}


/*var login = function(req, accesspattern, dbclient){
	le
}*/

exports.stdSelect = stdSelect