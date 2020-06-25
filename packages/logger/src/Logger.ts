import chalk from 'chalk'

export default class Logger {
	public static isBlocked = false
	private static queue: Array<string> = []
	private static prefixLen = 0

	public static log(prefix: string, ...message: Array<any>) {

		this.queue.push(this.formatMessage(prefix, ...message))
		while (this.queue.length > 0 && !this.isBlocked) {
			console.log(this.queue.shift())
		}
	}
	public static urgent(prefix: string, ...message: Array<any>) {

		console.log(this.formatMessage(prefix, ...message))
	}

	private static formatMessage(prefix: string, ...message: Array<any>): string {
		if (this.prefixLen < prefix.length) {
			this.prefixLen = prefix.length
		}
		const els: Array<string> = ['', '']
		if (this.prefixLen > prefix.length) {
			const diff = this.prefixLen - prefix.length
			els[0] = this.buildSpace(diff / 2 - (diff % 2 !== 0 ? 1 : 0))
			els[1] = this.buildSpace(diff / 2)
		}
		return `${chalk.white('[ ')}${els[0]}${chalk.blue(prefix)}${els[1]}${chalk.white(' ]')}: ${message.map((el) => typeof el === 'number' ? chalk.yellow(el.toString()) : chalk.white(el)).join(' ')}`
	}

	private static buildSpace(count: number): string {
		let str = ''
		for(let i = 0; i < count; i++) {
			str += ' '
		}
		return str
	}
}
