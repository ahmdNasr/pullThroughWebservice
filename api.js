'use strict'
const express = require('express')
const logic = require('./logic')

var generateRouter = function(accesspattern){
	let genRouterDefered = Promise.defer()
	let router = express.Router()

	
	router[accesspattern.method.toLowerCase()]( `/${accesspattern.name}`, (req, res) => {
		let logichandler = logic[accesspattern.name] || logic.stdSelect

		logichandler()
		.then((data) => res.json(data).end() )
		.catch((error) => res.json(error).end() )
	})

	router ? genRouterDefered.resolve(router) : generateRouter.reject(new Error("Could not create Router"))

	return genRouterDefered.promise
}


exports.generateRouter = generateRouter