export default class Queue {
	private queue = 0
	private isPaused = false
	private throwError?: Error

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

	public async add<T = any>(...promises: Array<Promise<T>>) {
		for (const promise of promises) {
			while (this.queue >= this.maxQueueLength || this.isPaused) {
				await new Promise((res) => setTimeout(res, this.timeToWait))
			}
			this.updateCurrentQueueLength(this.queue+1)
			promise
				.then(() => {
					this.updateCurrentQueueLength(this.queue-1)
				}).catch((e) => {
					this.updateCurrentQueueLength(this.queue-1)
					this.throwError = e
				})
		}
	}

	public async waitEnd() {
		while (this.queue !== 0) {
			if (this.throwError) {
				throw this.throwError
			}
			await new Promise((res) => setTimeout(res, this.timeToWait))
		}
	}
}
