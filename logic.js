'use strict'
const db = require('./db')


// extracts the params from the request object in right order
var extractParamsFromRequest = function(paramNames, req){
	let paramsDefered = Promise.defer()
	let params = []

	paramNames.forEach( (paramName) => {
		let paramValue = req.body[paramName]
		params.push(paramValue)
	})

	paramsDefered.resolve(params)
	return paramsDefered.promise
}

var stdSelect = function(request, accesspattern, dbclient){
	let selectDefered = Promise.defer()
	
	let cql = accesspattern.query || accesspattern.queries[0]
	
	extractParamsFromRequest(accesspattern.params, request).then( (params) => {
		db.executeCQL(dbclient, cql, params)
		  .then(selectDefered.resolve)
		  .catch(selectDefered.reject)
	})
	return selectDefered.promise
}


exports.stdSelect = stdSelect