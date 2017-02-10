'use strict'
const db = require('./db')
const jwt = require('jsonwebtoken')
const base64 = require('base-64')
const utf8 = require('utf8')

const decodeBase64Auth = (encoded) => {
	const bytes = base64.decode(encoded)
	const text = utf8.decode(bytes)
	const emailAndPassword = text.split(':')
	return emailAndPassword
} 

// extracts the params from the request object in right order
var extractParamsFromRequest = function(accesspattern, req){
	//console.log(accesspattern)
	let paramsDefered = Promise.defer()

	let params = []

	if(!accesspattern.isAuthPattern){

		const fetchFromQuery = (paramName) => {
			return req.query[paramName] 
			? req.query[paramName] 
			: paramsDefered.reject(new Error(`Parameter ${paramName} not found in request.query object.`))
		}

		const fetchFromBody = (paramName) => {
			return req.body[paramName] 
			? req.body[paramName] 
			: paramsDefered.reject(new Error(`Parameter ${paramName} not found in request.body object.`))
		}

		let paramNames = accesspattern.params
		

		paramNames.forEach( (paramName) => {
			let paramValue = accesspattern.method.toUpperCase() == "GET" ? fetchFromQuery(paramName) : fetchFromBody(paramName)
			params.push(paramValue)
		})

	} else{

		const fetchAuthFromHeaders = () => {
			return req.headers.authorization 
			? decodeBase64Auth(req.headers.authorization.split(' ')[1])
			: paramsDefered.reject(new Error(`Authorization not provided in headers!`))
		}

		params = fetchAuthFromHeaders()
	}

	paramsDefered.resolve(params)
	return paramsDefered.promise
}

var stdSelect = function(request, accesspattern, dbclient){
	let selectDefered = Promise.defer()

	let cql = accesspattern.query || accesspattern.queries[0]
	
	extractParamsFromRequest(accesspattern, request).then( (params) => {
	
		db.executeCQL(dbclient, cql, params)
		  .then(selectDefered.resolve)
		  .catch(selectDefered.reject)
	}).catch(selectDefered.reject)
	
	return selectDefered.promise
}

exports.stdSelect = stdSelect