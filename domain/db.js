'use strict'

var executeCQL = function(client, cql, params){

	let deferedObject = Promise.defer()

	client.execute(cql, params,  { prepare: true }, (err, result) => {
		err 
		? deferedObject.reject(err)
		: deferedObject.resolve(result.rowLength <= 1 ? result.rows[0] : result.rows)
	})

	return deferedObject.promise
}

const batchCQL = function(client, cqls){
	let deferedObject = Promise.defer()
	client.batch(cqls, { prepare: true }, deferedObject.resolve) // callback has 1 param -> result
	return deferedObject.promise
}

exports.executeCQL = executeCQL
exports.batchCQL = batchCQL