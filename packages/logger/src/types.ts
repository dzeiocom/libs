/**
 * Object Array
 */
export interface ObjectArray<T = any> {
	[key: string]: T
}

/**
 * used Internally,
 * the different types of logs
 */
export type logType = 'debug' | 'dir' | 'dirxml' | 'error' | 'info' | 'log' | 'trace' | 'warn'

/**
 * The possible themes
 */
export type theme = undefined | 'light' | 'dark'
