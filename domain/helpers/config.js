const cassandra = require ('cassandra-driver')
const PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider 


const db_connect = { 
	contactPoints: ['195.88.35.57','195.88.35.61','195.88.35.64'], 
	keyspace: 'comundo',
	authProvider: new PlainTextAuthProvider('std_harl', 'NFJgPa2-fHel15b_K4v7jY3mpGASTQM0' )
}

exports.db_connect = db_connect
