module.exports = () => { 
	return [
		{ 
			name: "login",
			params: ["username", "password"],
			queries: ["SELECT user_id FROM users_login WHERE email = ? AND password = ?"],
			description: "User login with basic authentication"
		},
		{
			name: "registration",
			params: ["email", "username", "password"],
			queries: ["FIND email, username, password;"]
		}
	]
}();


/*
access patterns 20161029 (20161101)

Q01: FIND [exists] BY email;
Q02: FIND user_id, firstname, lastname, profile_picture, username BY email AND password;
Q03: FIND user_id BY email;
Q04: FIND user_id BY username;
Q05: FIND user_id, expiration_datetime BY rst_url;
Q06: FIND event_name, event_picture, event_description BY datetime AND tags AND type;
Q07: FIND event_name, event_picture BY user_id AND date ORDER BY date DESC;
Q08: FIND counter_going, username, firstname, lastname, email, profile_picture BY event_id;
Q09: FIND firstname, lastname, email, username, profile_picture BY user_id; (FRIENDS)
Q10: FIND describtion, birthdate, email, username, isCompany, firstname, lastname BY user_id;
Q11: FIND type, description, title_picture, datetime, tags, prerequisites, firstname, lastname, profile_picture, email, username, pictures BY event_id;


*/