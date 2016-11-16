const db = require('./db')


// extracts the params from the request object 
var getParams = function(req){

}

var stdSelect = function(request, accesspattern, dbclient){
	let selectDefered = Promise.defer()

	let cql = accesspattern.query || accesspattern.queries[0]
	let params = getParams(request, accesspattern)

	db.executeCQL(dbclient, cql, params)
	  .then(selectDefered.resolve)
	  .catch(selectDefered.reject)

	return selectDefered.promise
}