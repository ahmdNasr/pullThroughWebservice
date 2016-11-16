'use strict'
const express = require('express')
const logic = require('./logic')

var generateRouter = function(accesspattern){
	let genRouterDefered = Promise.defer()
	let router = express.Router()

	
	router[accesspattern.method.toLowerCase()]( accesspattern.name, (req, res) => {
		let logichandler = logic[accesspattern.name] || logic.stdSelect

		logichandler()
		.then(generateRouter.resolve)
		.catch(generateRouter.reject)
	})

	//genRouterDefered.resolve(router)

	return genRouterDefered.promise
}


exports.generateRouter = generateRouter