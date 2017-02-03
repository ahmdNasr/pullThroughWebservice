
const loginAccessPattern = {
	params: ["email", "password"],
	queries: ["SELECT user_id, firstname, lastname, username FROM users_by_email WHERE email = ? AND password = ?;"]
}

var doBasicAuth = function(data){
	let authDefered = Promise.defer()
	console.log("doBasicAuth...")
	data && Object.keys(obj).length === 0
	? authDefered.resolve() 
	: authDefered.reject({ status: 500, errorMessage: "This query needs authentication!" })

	return authDefered.promise
}

const authentication = 1

exports.authentication = authentication