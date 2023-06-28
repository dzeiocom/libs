import { black, blue, green, white, yellow } from 'colorette'
import { ObjectArray, logType, theme } from '../typing/types'

export default class Logger implements Console {

	/**
	 * The maximun prefix length
	 */
	private static prefixLen = 0

	/**
	 * Current theme in use
	 *
	 * - undefined = detect theme
	 * - light = theme for light background
	 * - dark = theme for dark background
	 */
	private static theme: theme = undefined

	/**
	 * List of loggers currently in use
	 */
	private static loggers: Array<Logger> = []

	/**
	 *Define if you want a timestamp with your logs
	 *
	 * @static
	 * @memberof Logger
	 */
	public static timestamp = false

	// NodeJS console (will be undefined on )
	/**
	 * NODEJS ONLY
	 * It will be undefined in Browser context
	 */
	// @ts-ignore
	public Console = console.Console
	/**
	 * The messages queue
	 */
	private queue: Array<{type: logType, msg: Array<any>}> = []

	/**
	 * If true message won't be shown to console
	 * (`urgent` message will still show)
	 */
	private blocked = false

	/**
	 * `count` function object value
	 */
	private countCount: ObjectArray<number> = {}

	/**
	 * `time` function object value
	 */
	private timeCount: ObjectArray<Date> = {}

	/**
	 * Construct a new Logger
	 * @param prefix the prefix shown
	 */
	public constructor(
		public prefix: string = 'Logger'
	) {
		Logger.loggers.push(this)
	}

	/**
	 * STATIC FUNCTIONS
	 */

	/**
	 * Choose if every loggers should be blocked or not
	 * @param value
	 */
	public static isBlocked(value: boolean) {
		for (const lgr of this.loggers) {
			lgr.blocked = value
			if (!value) {
				lgr.processQueue()
			}
		}
	}

	/**
	 * Force a specific theme to be used
	 *
	 * (if undefined it will try to detect it)
	 *
	 * @param themeChosen The theme chosen to be overriden
	 */
	public static forceTheme(themeChosen: theme) {
		this.theme = themeChosen
	}

	/**
	 * INSTANCE FUNCTIONS
	 */

	/**
	 * return nothing if `condition` is `true`, log `data` if it is not
	 * @param condition The value tested for being truthy
	 * @param data The message to pass if `condition` is false
	 */
	public assert(condition?: boolean | undefined, ...data: Array<any>): void {
		if (!condition) {
			return this.error('Assertion failed:', ...data)
		}
	}

	/**
	 * Clear the console/terminal
	 */
	public clear(): void {
		console.clear()
	}

	/**
	 * log the number of times `count` has been called
	 * @param label Display label, default to `default`
	 */
	public count(label: string = 'default'): void {
		if (!Object.prototype.hasOwnProperty.call(this.countCount, label)) {
			this.countCount[label] = 0
		}
		this.log(`${label}:`, ++this.countCount[label])
	}

	/**
	 * Reset the count started with `count` function
	 * @param label Display label, default to `default`
	 */
	public countReset(label: string = 'default'): void {
		delete this.countCount[label]
	}

	/**
	 * log as debug the `data`
	 * (On browser like Chrome in the devtool you have to enable it beforehand)
	 * @param data the data to log
	 */
	public debug(...data: Array<any>): void {
		this.process('debug', data)
	}

	/**
	 * NOTE: Method not fully implemented
	 *
	 * print a full object to the logger
	 * @param item Object to log
	 * @param options (NodeJS only) option for the display
	 */
	public dir(item?: any, options?: {showHidden?: boolean, depth?: number, colors?: boolean}): void {
		if (typeof item !== 'object') {
			return this.log(item)
		}
		this.log('Method not fully implemented')
		if (typeof window !== 'undefined') {
			console.dir(item)
			return
		}
		console.dir(item, options)
	}

	/**
	 * Alias for `log` function
	 * @param data data to log
	 */
	public dirxml(...data: Array<any>): void {
		this.process('dirxml', data)
	}

	/**
	 * print to stderr on NodeJS, print with red coloring on browsers
	 * @param data data to log
	 */
	public error(...data: Array<any>): void {
		this.process('error', data)
	}

	/**
	 * Alias to `error` function
	 * @param data data to log
	 */
	public exception(...data: Array<any>): void { // NOT STANDARD / FIREFOX ONLY
		this.error(...data)
	}

	/**
	 * NodeJS -> Increase the indentation of future logs with `label` as header
	 *
	 * Browser -> Group futures logs
	 * @param label labels to use as header
	 */
	public group(...label: Array<any>): void {
		console.group(...label)
	}

	/**
	 * Alias of `group` function
	 * @param label label to use as header
	 */
	public groupCollapsed(...label: Array<any>): void {
		this.group(...label)
	}

	/**
	 * End the current group started with the `group` function
	 */
	public groupEnd(): void {
		console.groupEnd()
	}

	/**
	 * Log to console as Info
	 * (Only Chrome else it is an alias of `log`)
	 * @param data data to log
	 */
	public info(...data: Array<any>): void {
		this.process('info', data)
	}

	/**
	 * Log to console
	 * @param data data to log
	 */
	public log(...data: Array<any>) {
		this.process('log', data)
	}

	/**
	 * make a new profile in browsers or in NodeJS with `--inspect` flag
	 * @param name Profile name
	 */
	public profile(name?: string) {
		// @ts-ignore
		if (console.profile) {
			// @ts-ignore
			console.profile(name)
		} else {
			throw new Error('profile don\'t exist in the current contexte')
		}
	}

	/**
	 * end the current running profile
	 * @param name Profile name
	 */
	public profileEnd(name?: string) {
		// @ts-ignore
		console.profileEnd(name)
	}

	/**
	 * Print a Table to the console
	 * @param tabularData Table data
	 * @param properties Table properties
	 */
	public table(tabularData?: any, properties?: Array<string> | undefined): void {
		console.table(tabularData, properties)
	}

	/**
	 * Start a timer
	 * @param label Timer label
	 */
	public time(label: string = 'default'): void {
		if (!Object.prototype.hasOwnProperty.call(this.timeCount, label)) {
			this.timeCount[label] = new Date()
			return
		}
		this.warn(`Timer '${label}' already exists.`)
	}

	/**
	 * End a timer
	 * @param label Timer label
	 */
	public timeEnd(label: string = 'default'): void {
		const diff = (new Date()).getTime() - this.timeCount[label].getTime()
		this.log(`${label}: ${diff}ms - Timer ended`)
		delete this.timeCount[label]
	}

	/**
	 * Log to the console with timer before it
	 * @param label Timer label
	 * @param data data to log next to the timer
	 */
	public timeLog(label: string = 'default', ...data: Array<any>): void {
		if (!this.timeCount[label]) {
			this.warn(`Timer '${label}' does not exist`)
			return
		}
		const diff = (new Date()).getTime() - this.timeCount[label].getTime()
		this.log(`${label}: ${diff}ms`, ...data)
	}

	/**
	 * Browsers only, Add maker in the browser's Performance or Waterfall tool
	 * @param label Label to use
	 */
	public timeStamp(label?: string): void {
		console.timeStamp(label)
	}

	/**
	 * Print a stack trace to console
	 * @param data data to trace
	 */
	public trace(...data: Array<any>): void {
		this.process('trace', data)
	}

	/**
	 * Warn in the console
	 * (in NodeJS context it is an alias to the `error` function)
	 * @param data data to log
	 */
	public warn(...data: Array<any>): void {
		this.process('warn', data)
	}

	/**
	 * Log to the console but skiping `isBlocked` check
	 * @param data data to log
	 */
	public urgent(...data: Array<any>) {
		console.log(...this.formatMessage(data))
	}

	/**
	 * Precoess a message sent by one of the public functions
	 * @param type logType
	 * @param message message to log
	 */
	private process(type: logType, message: Array<any>) {
		this.queue.push({type, msg: this.formatMessage(message)})
		this.processQueue()
	}

	/**
	 * Format a message for the console
	 * @param message message to format
	 */
	private formatMessage(message: Array<any>): Array<any> {
		const prefix = this.prefix
		const prefixLen = prefix.length

		if (Logger.prefixLen < prefixLen) {
			Logger.prefixLen = prefixLen
		}

		const spacers: Array<string> = ['', '']
		if (Logger.prefixLen > prefixLen) {
			const diff = Logger.prefixLen - prefixLen
			const diff2 = diff /2
			spacers[0] = this.buildSpace(diff2 - (diff % 2 !== 0 ? 1 : 0))
			spacers[1] = this.buildSpace(diff2)
		}
		const res: Array<any> = [
			`${this.blackOrWhite('[ ')}${spacers[0]}${blue(prefix)}${spacers[1]}${this.blackOrWhite(' ]')}:`
		]

		if (Logger.timestamp) {
			const now = new Date()
			const h = now.getHours() >= 10 ? now.getHours().toString() : `0${now.getHours()}`
			const m = now.getMinutes() >= 10 ? now.getMinutes().toString() : `0${now.getMinutes()}`
			const s = now.getSeconds() >= 10 ? now.getSeconds().toString() : `0${now.getSeconds()}`
			res.unshift(`${this.blackOrWhite('<')}${yellow(h)}:${yellow(m)}:${yellow(s)}${this.blackOrWhite('>')}`)
		}
		return res.concat(
			message.map((el) => {
				if (typeof el === 'object') {
					return el
				}
				if (el === undefined) {
					return yellow('undefined')
				}
				if (el === null) {
					return yellow('null')
				}
				return typeof el !== 'string' ? yellow(el.toString()) : green(el)
			})
		)
	}

	/**
	 * Process Waiting queue
	 */
	private processQueue() {
		while (this.queue.length > 0 && !this.blocked) {
			const item = this.queue.shift()
			if (!item) {
				continue
			}
			if (item.type === 'trace') {
				console.log(item.msg.shift())
			}
			console[item.type](...item.msg)
		}
	}

	/**
	 * Build a new string of `count` spaces
	 * @param count number of spaces to add
	 */
	private buildSpace(count: number): string {
		return ''.padStart(count, ' ')
	}

	/**
	 * Color the text in black or white depending on `theme` variable or detection
	 * @param text the text to color
	 */
	private blackOrWhite(text: string): string {
		if ((!Logger.theme && typeof window !== 'undefined') || Logger.theme === 'light') {
			return black(text)
		}
		return white(text)
	}

}

/**
 * Export a default Logger
 */
export const logger = new Logger()
