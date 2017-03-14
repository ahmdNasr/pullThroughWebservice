'use strict'
const db = require('./db')
const jwt = require('jsonwebtoken')
const base64 = require('base-64')
const utf8 = require('utf8')
const uuidV1 = require('uuid/v1');

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
	
	extractParamsFromRequest(accesspattern, request)
	.then( params => db.executeCQL(dbclient, cql, params) )
	.then(selectDefered.resolve)
	.catch(selectDefered.reject)

	return selectDefered.promise
}

const generators = {
	generateUUID: () => {
		return uuidV1() // !!!!!!!!!!!!!!!!!!!!!!!!!!!! change 
	}
}

const generatorTMPValues = {}

// get index of param by paramName from accesspattern.params
// get param value by index
// push to params array		
const buildParamArray = (accesspattern, indexOfQuery, allParams, substituteParamNames) => {
	const params = []
	substituteParamNames.forEach( pName => {
		let matchesGen = pName.match(/^\!+(\w+)$/) // matches !!!!!!!!!!generateUUID for example 
		let paramValue;
		if ( matchesGen ) {
			const genFunctionName = matchesGen[1] // second element

			if ( indexOfQuery == 0 ) { // firstGeneration -> needs to call generator
				paramValue = generators[genFunctionName]()
				generatorTMPValues[genFunctionName] = paramValue // set/replace value
			} else {
				paramValue = generatorTMPValues[genFunctionName]
			}
			
		} else {
			const index = accesspattern.params.indexOf(pName)
			paramValue = allParams[index]
		}

		params.push(paramValue)
	})
	return params
}

var stdBatch = function(request, accesspattern, dbclient){
	let batchDefered = Promise.defer()
	
	extractParamsFromRequest(accesspattern, request)
	.then( (allParams) => {
		let cqls = accesspattern.queries.map( (cql, indexOfQuery)=> {
			const query = cql.query
			const paramNames = cql.params
			
			const paramValues = buildParamArray(accesspattern, indexOfQuery, allParams, paramNames)
			
			return 	{ query: query, params: paramValues }
		})
		return db.batchCQL(dbclient, cqls)					
	})
	.then(batchDefered.resolve)
	.catch(batchDefered.reject)

	
	return batchDefered.promise
}


exports.stdSelect = stdSelect
exports.stdBatch = stdBatch