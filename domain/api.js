'use strict'
const express = require('express')
const fs = require('fs')
const logic = require('./logic')
//const middleware = require('./middleware')

const loggerFactory = require('./helpers/logger.js')
const apiErrorLogger = loggerFactory("ERROR")

const loginAccessPattern = {
	isAuthPattern: true,
	params: ["email", "password"],
	queries: ["SELECT user_id, firstname, lastname, username FROM users_by_email WHERE email = ? AND password = ?;"]
}


var doBasicAuth = function(data){
	let authDefered = Promise.defer()
	console.log("doBasicAuth...")
	data 
	? authDefered.resolve() 
	: authDefered.reject({ status: 500, errorMessage: "This query needs authentication!" })

	return authDefered.promise
}

var generateRouter = function(accesspattern, dbclient){
	let genRouterDefered = Promise.defer()
	let router = express.Router()

	if(accesspattern.authRequired){
		router.use((req, res, next) => {
			logic.stdSelect(req, loginAccessPattern, dbclient)
				.then(doBasicAuth)
				.then(next)
				.catch((error) => {
					res.status(401).json(error).end() // 401 -> Unauthorized
					//apiErrorLogger(`Error on Request: ${error}`)
				})
		})
	}

	const method = accesspattern.method.toLowerCase()
	const isSelectPattern = method == 'get'

	router[method]( `/${accesspattern.name}`, (req, res) => {
		let logichandler = logic[accesspattern.name] || isSelectPattern ? logic.stdSelect : logic.stdBatch

		logichandler(req, accesspattern, dbclient)
		.then((data) => res.status(200).json(data).end() ) // 200 -> OK
		.catch((error) => res.status(500).json(error).end() ) // 500 -> Internal Server Error
	})

	router ? genRouterDefered.resolve(router) : generateRouter.reject(new Error("Could not create Router"))
	
	//exportRouterStacks(router, accesspattern)
	
	return genRouterDefered.promise
}

const exportRouterStacks = (router, accesspattern) => {
	fs.writeFile(
		__dirname+'/../doc/routers/'+accesspattern.name+'.txt', 
		JSON.stringify(router.stack, null, 2)
	)
}

exports.generateRouter = generateRouter