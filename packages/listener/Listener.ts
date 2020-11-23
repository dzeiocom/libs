type ItemToArray<T> = {
	[P in keyof T]?: Array<T[P]>
}

export default abstract class Listener<
	T extends Record<string, (...args: Array<any>) => void> = {
		newListener: (eventName: string, listener: (...args: Array<any>) => void) => void
		removeListener: (eventName: string, listener: (...args: Array<any>) => void) => void
	}
> {

	private maxListeners = 10

	private handlers: ItemToArray<T> = {}

	/**
	 * Add a listener to the event
	 * @param event the event name
	 * @param listener the listener
	 */
	public addListener(event: keyof T, listener: T[typeof event]) {
		return this.on(event, listener)
	}

	/**
	 * Add a listener to the event
	 * @param event the event name
	 * @param listener the listener
	 */
	public on(event: keyof T, listener: T[typeof event]) {
		return this.internalAdd(true, event, listener)
	}

	/**
	 * Add a one time trigger listener to the event
	 * @param event the event name
	 * @param listener the listener
	 */
	public once(event: keyof T, listener: T[typeof event]) {
		const fn = (...args: Array<any>) => {
			listener(...args)
			this.off(event, fn as any)
		}
		this.on(event, fn as any)
		return this
	}

	/**
	 * remove a listener from the event
	 * @param event the event name
	 * @param listener the listener
	 */
	public removeListener(event: keyof T, listener: T[typeof event]) {
		return this.off(event, listener)
	}

	/**
	 * remove a listener from the event
	 * @param event the event name
	 * @param listener the listener
	 */
	public off(event: keyof T, listener: T[typeof event]) {
		const listeners = this.listeners(event)
		const index = listeners.indexOf(listener)
		if (index !== -1) {
			(this.handlers[event] as Array<T[typeof event]>).splice(index, 1)
		}

		// @ts-ignore
		this.emit('removeListener', event, listener)
		return this
	}

	/**
	 * remove every listeners from the event
	 * @param event the event name
	 */
	public removeAllListeners(event: keyof T) {
		const listeners = this.listeners(event)
		listeners.forEach((ev) => this.off(event, ev))
		return this
	}

	/**
	 * set a maximum numbre of listeners before sending a warning
	 * @param n the number of listeners before sending the warning
	 */
	public setMaxListeners(n: number) {
		this.maxListeners = n
	}

	/**
	 * Return the current max number of listeners
	 */
	public getMaxListeners() {
		return this.maxListeners
	}

	/**
	 * return every listeners from the event
	 * @param event the event name
	 */
	public listeners(event: keyof T) {
		const item = this.handlers[event] as Array<T[typeof event]>
		return item ?? []
	}

	/**
	 * return every listeners from the event
	 * @param event the event name
	 */
	public rawListeners(event: keyof T) {
		return this.listenerCount(event)
	}

	/**
	 * Emit the event with the selected variables
	 * @param event the event to emit
	 * @param ev the variables to send
	 */
	public emit(event: keyof T, ...ev: Parameters<T[typeof event]>) {
		const listeners = this.listeners(event)
		listeners.forEach((fn) => fn(...ev))
		return listeners.length > 0
	}

	/**
	 * return the number of events in the current event
	 * @param event the event
	 */
	public listenerCount(event: keyof T) {
		return this.listeners(event).length
	}

	/**
	 * prepend the listener to the event list
	 * @param event the event
	 * @param listener the listener to attach
	 */
	public prependListener(event: keyof T, listener: T[typeof event]) {
		return this.internalAdd(false, event, listener)
	}

	/**
	 * prepend the listener to the event list to triggered once
	 * @param event the event
	 * @param listener the listener to attach
	 */
	public prependOnceListener(event: keyof T, listener: T[typeof event]) {
		const fn = (...args: Parameters<typeof listener>) => {
			listener(...args)
			this.off(event, fn as any)
		}
		this.prependListener(event, fn as any)
		return this
	}

	/**
	 * get every event names with at least one event
	 */
	public eventNames() {
		return Object.keys(this.handlers)
	}

	// Browser Listeners
	public addEventListener(event: keyof T, listener: T[typeof event]) {
		return this.on(event, listener)
	}

	public removeEventListener(event: keyof T, listener: T[typeof event]) {
		return this.off(event, listener)
	}

	private internalAdd(push: boolean, event: keyof T, listener: T[typeof event]) {
		// @ts-ignore
		this.emit('newListener', event, listener)
		const item = this.handlers[event]
		if (!item) {
			this.handlers[event] = [listener]
		} else {
			if (push) {
				item.push(listener)
			} else {
				item.unshift(listener)
			}
		}
		const listenerCount = this.listenerCount(event)
		if (listenerCount > this.getMaxListeners()) {
			console.warn(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this.getMaxListeners()} userStateChanged listeners added to [FireAuth]. Use emitter.setMaxListeners() to increase limitWarning: more than  are in the event ${event}! (${listenerCount})`)
		}
		return this
	}
}
