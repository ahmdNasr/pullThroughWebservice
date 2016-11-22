'use strict'

const log4js = require('log4js')
const config = require('./config.js')

log4js.configure(config.log4js)

function loggerFactory(level){
	let logger = log4js.getLogger('nodejs-v6.9.1')
	logger.setLevel(`${level}`)

	return logger
}


/*
logger.trace('a trace message')
logger.debug('a debug message')
logger.info('an info message')
logger.warn('a warning message')
logger.error('error: es hat funktioniert message')
logger.fatal('halloo')
*/



module.exports = loggerFactory