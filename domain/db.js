'use strict'

var executeCQL = function(client, cql, params){
console.log(params)
	let deferedObject = Promise.defer()

	client.execute(cql, params,  { prepare: true }, (err, result) => {
		err 
		? deferedObject.reject(err)
		: deferedObject.resolve(result.rowLength <= 1 ? result.rows[0] : result.rows)
	})

	return deferedObject.promise
}



exports.executeCQL = executeCQL