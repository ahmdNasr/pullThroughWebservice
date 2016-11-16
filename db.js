
var executeCQL = function(client, cql, params){

	deferedObject = Promise.defer()

	client.execute(cql, params, (err, result) => {
		err 
		? deferedObject.reject(err)
		: deferedObject.resolve(result.rowLength <= 1 ? result.rows[0] : result.rows)
	})

	return deferedObject.promise
}