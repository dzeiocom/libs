import Logger from '@dzeio/logger'

const logger = new Logger('Queue')

export default class Queue {
	private queue = 0
	private isPaused = false

	public constructor(
		private maxQueueLength = 5,
		private timeToWait = 500
	) {}

	public pause() {
		this.isPaused = true
	}

	public start() {
		this.isPaused = false
	}

	public updateCurrentQueueLength(len: number) {
		this.queue = len
	}

	public async add<T = any>(promise: Promise<T>) {
		while (this.queue >= this.maxQueueLength || this.isPaused) {
			await new Promise((res) => setTimeout(res, this.timeToWait))
		}
		this.updateCurrentQueueLength(this.queue+1)
		promise
			.then(() => {
				this.updateCurrentQueueLength(this.queue-1)
			}).catch(() => {
				this.updateCurrentQueueLength(this.queue-1)
			})
	}

	public async waitEnd() {
		let currentQueue = this.queue
		while (this.queue !== 0) {
			await new Promise((res) => setTimeout(() => {
				if (currentQueue !== this.queue) {
					logger.log('PromiseQueue', this.queue, 'remaining in queue')
					currentQueue = this.queue
				}
				res()
			}, this.timeToWait))
		}
	}
}
