
const loginAccessPattern = {
	params: ["email", "password"],
	queries: ["SELECT user_id, firstname, lastname, username FROM users_by_email WHERE email = ? AND password = ?;"]
}

var doBasicAuth = function(data){
	let authDefered = Promise.defer()
	console.log("doBasicAuth"+ data)
	data 
	? authDefered.resolve() 
	: authDefered.reject({ status: 500, errorMessage: "This query needs authentication!" })

	return authDefered.promise
}

const authentication = function(req, res, next) {
	logic.stdSelect(req, loginAccessPattern, dbclient)
		.then(doBasicAuth)
		.then(next)
		.catch((error) => {
			res.status(401).json(error).end() // 401 -> Unauthorized
			//apiErrorLogger(`Error on Request: ${error}`)
		})
}

exports.authentication = authentication