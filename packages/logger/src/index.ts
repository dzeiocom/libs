import Logger from './Logger'

// Browser Import

/**
 * Init Logger in global context and add function to replace default console
 */

// @ts-expect-error
window.Logger = Logger
// @ts-expect-error
window.initConsole = function() {
	window.console = new Logger('Console')
}
