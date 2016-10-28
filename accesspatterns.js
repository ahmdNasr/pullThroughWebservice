module.exports = () => { 
	return [
		{ 
			name: "login",
			params: ["username", "password"],
			queries: ["SELECT user_id FROM users_login WHERE email = ? AND password = ?"],
			description: "User login with basic authentication"
		},
		{ queries
			name: "registration",
			params: ["email", "username", "password"],
			queries: ["FIND email, username, password;"]
		}
	]
}();