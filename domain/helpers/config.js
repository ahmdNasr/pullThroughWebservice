const cassandra = require ('cassandra-driver')
const PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider 


const db_connect = { 
	contactPoints: ['195.88.35.57','195.88.35.61','195.88.35.64'], 
	keyspace: 'comundo_prod',
	authProvider: new PlainTextAuthProvider('std_harl', 'wfW4!S6V&A_A96_5fWc9+7#BRMo+XPCX' )
}

const log4js = {
	appenders: [
		{
			type: 'log4js-ain2',
			tag: 'webservice',
			facility: 'local4',
			hostname: '195.88.35.64',
			port: 12203,
			transport: 'UDP'
		}
	]
}

const jwtSecret = "SEComundoRET"

exports.db_connect = db_connect
exports.log4js = log4js
exports.jwtSecret = jwtSecret
