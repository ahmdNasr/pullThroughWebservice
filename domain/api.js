'use strict'
const express = require('express')
const logic = require('./logic')
const middleware = require('./middleware')

const loggerFactory = require('./helpers/logger.js')
const apiErrorLogger = loggerFactory("ERROR")

var generateRouter = function(accesspattern, dbclient){
	let genRouterDefered = Promise.defer()
	let router = express.Router()

	if(accesspattern.authRequired)
		router.use(middleware.authentication)
	
	
	router[accesspattern.method.toLowerCase()]( `/${accesspattern.name}`, (req, res) => {
		let logichandler = logic[accesspattern.name] || logic.stdSelect

		logichandler(req, accesspattern, dbclient)
		.then((data) => res.status(200).json(data).end() ) // 200 -> OK
		.catch((error) => res.status(500).json(error).end() ) // 500 -> Internal Server Error
	})

	router ? genRouterDefered.resolve(router) : generateRouter.reject(new Error("Could not create Router"))

	return genRouterDefered.promise
}


exports.generateRouter = generateRouter