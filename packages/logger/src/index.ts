import Logger from './Logger'

// Browser Import

/**
 * Init Logger in global context and add function to replace default console
 */

// @ts-expect-error
window.Logger = Logger
// @ts-expect-error
window.logger = new Logger('Console')
// @ts-expect-error
window.initConsole = function() {
	console.log('// @deprecated Now use window.logger to get the correct logger')
}
