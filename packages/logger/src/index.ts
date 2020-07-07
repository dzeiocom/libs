import Logger from './Logger'

// Browser Import

/**
 * Init Logger in global context and add function to replace default console
 */

// @ts-ignore
window.Logger = Logger
// @ts-ignore
window.initConsole = function() {
	window.console = new Logger('Console')
}
