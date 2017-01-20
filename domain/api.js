'use strict'
const express = require('express')
const logic = require('./logic')

const loginAccessPattern = {
	params: ["email", "password"],
	queries: ["SELECT user_id, firstname, lastname, profile_picture, username FROM users_by_email WHERE email = ? AND password = ?;"]
}

var doBasicAuth = function(data){
	let authDefered = Promise.defer()
	console.log("doBasicAuth"+ data)
	data 
	? authDefered.resolve() 
	: authDefered.reject({ status: 500, errorMessage: "This query needs authentication!" })

	return authDefered.promise
}

var generateRouter = function(accesspattern, dbclient){
	let genRouterDefered = Promise.defer()
	let router = express.Router()

	if(accesspattern.authRequired){
		router.use( (req, res, next) => {
			logic.stdSelect(req, loginAccessPattern, dbclient)
			.then(doBasicAuth)
			.then(next)
			.catch((error) => res.json(error).end() )
		})
	}
	
	router[accesspattern.method.toLowerCase()]( `/${accesspattern.name}`, (req, res) => {
		let logichandler = logic[accesspattern.name] || logic.stdSelect

		logichandler(req, accesspattern, dbclient)
		.then((data) => res.json(data).end() )
		.catch((error) => res.json(error).end() )
	})

	router ? genRouterDefered.resolve(router) : generateRouter.reject(new Error("Could not create Router"))

	return genRouterDefered.promise
}


exports.generateRouter = generateRouter