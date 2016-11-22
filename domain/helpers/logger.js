const log4js = require('log4js')
const config = require('./config.js')
log4js.configure({
	appenders: [
		{
			type: 'log4js-ain2',
			tag: 'webservice',
			facility: 'local4',
			hostname: '195.88.35.64',
			port: 12203,
			transport: 'UDP',
			password:"NFJgPa2-fHel15b_K4v7jY3mpGASTQM0"
		}
	]
})

var logger = log4js.getLogger('nodejs-v6.9.1')

logger.setLevel('ERROR')

/*
logger.trace('a trace message')
logger.debug('a debug message')
logger.info('an info message')
logger.warn('a warning message')
logger.error('error: es hat funktioniert message')
logger.fatal('halloo')
*/

exports.logger = logger