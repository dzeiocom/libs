import { white, blue, yellow, green } from 'chalk'

/**
 * Logger Class
 */
export default class Logger {

	/**
	 * If it is set to true all message won't be shown until it is set to false
	 */
	public static isBlocked = false
	private static queue: Array<Array<any>> = []
	private static prefixLen = 0

	/**
	 * Log a message into the console
	 * @param prefix the prefix used
	 * @param message the message to log
	 */
	public static log(prefix: string, ...message: Array<any>) {
		this.queue.push(this.formatMessage(prefix, ...message))
		while (this.queue.length > 0 && !this.isBlocked) {
			const item = this.queue.shift()
			if (!item) {
				continue
			}
			console.log(...item)
		}
	}

	/**
	 * Log a message into the console (passthrough the `Logger.isBlocked` boolean)
	 * @param prefix The prefix used
	 * @param message the message to log
	 */
	public static urgent(prefix: string, ...message: Array<any>) {
		console.log(this.formatMessage(prefix, ...message))
	}

	private static formatMessage(prefix: string, ...message: Array<any>): Array<any> {
		if (this.prefixLen < prefix.length) {
			this.prefixLen = prefix.length
		}
		const els: Array<string> = ['', '']
		if (this.prefixLen > prefix.length) {
			const diff = this.prefixLen - prefix.length
			els[0] = this.buildSpace(diff / 2 - (diff % 2 !== 0 ? 1 : 0))
			els[1] = this.buildSpace(diff / 2)
		}
		const res: Array<any> = [
			`${white('[ ')}${els[0]}${blue(prefix)}${els[1]}${white(' ]')}:` // prefix
		].concat(
			message.map((el) => {
				if (typeof el === 'object') {
					return el
				}
				return typeof el !== 'string' ? yellow(el.toString()) : green(el)
			})
		)
		return res
	}

	private static buildSpace(count: number): string {
		let str = ''
		for(let i = 0; i < count; i++) {
			str += ' '
		}
		return str
	}
}
