type RecordToArray<T> = {
	[P in keyof T]?: Array<T[P]>
}

type EventList = Record<string, (...args: Array<any>) => void>

type BaseEvents<T extends EventList = {}> = {
	newListener: (eventName: string, listener: (...args: Array<any>) => void) => void
	removeListener: (eventName: string, listener: (...args: Array<any>) => void) => void
	all: (eventName: string, ...args: Array<any>) => void
} & T

/**
 * Allows you to create a typed event handler system
 */
export default class Listener<
	T extends EventList = BaseEvents
> {

	private maxListeners = 10

	private handlers: RecordToArray<BaseEvents<T>> = {}

	/**
	 * Add a listener to the event
	 * @param event the event name
	 * @param listener the listener
	 * @returns the class
	 */
	public addListener<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		return this.on(event, listener)
	}

	/**
	 * Add a listener to the event
	 *
	 * @param event the event name
	 * @param listener the listener
	 *
	 * @returns the class
	 */
	public on<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		return this.internalAdd(true, event, listener)
	}

	/**
	 * Add a one time trigger listener to the event
	 *
	 * @param event the event name
	 * @param listener the listener
	 *
	 * @returns the class
	 */
	public once<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		const fn = (...args: Array<any>) => {
			listener(...args)
			this.off(event, fn as BaseEvents<T>[Key])
		}
		return this.on(event, fn as BaseEvents<T>[Key])
	}

	/**
	 * remove a listener from the event
	 *
	 * @param event the event name
	 * @param listener the listener
	 *
	 * @returns the class
	 */
	public removeListener<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		return this.off(event, listener)
	}

	/**
	 * remove a listener from the event
	 *
	 * @param event the event name
	 * @param listener the listener
	 *
	 *
	 * @returns the class
	 */
	public off<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		return this.internalRemove(event, listener)
	}

	/**
	 * remove every listeners from the event
	 *
	 * @param event the event name
	 *
	 * @returns the class
	 */
	public removeAllListeners(event: keyof BaseEvents<T>): this {
		return this.internalRemove(event)
	}

	/**
	 * set a maximum number of listeners before sending a warning
	 *
	 * @param count the number of listeners before sending the warning
	 *
	 * @returns the class
	 */
	public setMaxListeners(count: number): this {
		this.maxListeners = count

		return this
	}

	/**
	 * Return the current max number of listeners
	 *
	 * @returns the maximum number of listeners before it send warnings
	 */
	public getMaxListeners(): number {
		return this.maxListeners
	}

	/**
	 * return every listeners from the event
	 *
	 * @param event the event name
	 *
	 * @returns the list of events
	 */
	public listeners<Key extends keyof BaseEvents<T>>(event: Key): Array<BaseEvents<T>[Key]> {
		return this.handlers[event] ?? []
	}

	/**
	 * return every listeners from the event
	 *
	 * @param event the event name
	 *
	 * @returns the list of listenersattached to the event
	 */
	public rawListeners<Key extends keyof BaseEvents<T>>(event: Key): Array<BaseEvents<T>[Key]> {
		return this.listeners(event)
	}

	/**
	 * Emit the event with the selected variables
	 *
	 * @param event the event to emit
	 * @param ev the variables to send
	 *
	 * @return if the evenet was emitted to any listeners or not
	 */
	public emit<Key extends keyof BaseEvents<T>>(event: Key, ...ev: Parameters<BaseEvents<T>[Key]>): boolean {
		if (event !== 'all') {
			// @ts-expect-error the all event is sent each time a new event is emitted
			this.emit('all', event, ...ev)
		}
		const listeners = this.listeners(event)
		listeners.forEach((fn) => fn(...ev))
		return listeners.length > 0
	}

	/**
	 * return the number of events in the current event
	 *
	 * @param event the event
	 *
	 * @returns the number of listeners attached to the event
	 */
	public listenerCount(event: keyof BaseEvents<T>): number {
		return this.listeners(event).length
	}

	/**
	 * prepend the listener to the event list
	 *
	 * @param event the event
	 * @param listener the listener to attach
	 *
	 * @returns the class
	 */
	public prependListener<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		return this.internalAdd(false, event, listener)
	}

	/**
	 * prepend the listener to the event list to triggered once
	 *
	 * @param event the event
	 * @param listener the listener to attach
	 *
	 * @returns the class
	 */
	public prependOnceListener<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		const fn = (...args: Parameters<typeof listener>) => {
			listener(...args)
			this.off(event, fn as any)
		}
		this.prependListener(event, fn as any)
		return this
	}

	/**
	 * get every event names with at least one event
	 *
	 * @returns the list of events keys
	 */
	public eventNames(): Array<keyof BaseEvents<T>> {
		return Object.keys(this.handlers)
	}

	/**
	 * Add a listener to the event
	 *
	 * @param event the event name
	 * @param listener the listener
	 *
	 * @returns the class
	 */
	public addEventListener<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		return this.on(event, listener)
	}

	/**
	 * remove a listener from the event
	 *
	 * @param event the event name
	 * @param listener the listener
	 *
	 * @returns the class
	 */
	public removeEventListener<Key extends keyof BaseEvents<T>>(event: Key, listener: BaseEvents<T>[Key]): this {
		return this.off(event, listener)
	}

	private internalAdd<Key extends keyof BaseEvents<T>>(push: boolean, event: Key, listener: BaseEvents<T>[Key]): this {
		// @ts-expect-error Meta Listener that emit when a new event is addrd
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
			console.warn(`MaxListenersExceededWarning: Possible Listener memory leak detected. ${this.getMaxListeners()} listeners recommended while there is ${listenerCount} listeners. Use setMaxListeners() to increase the limit`)
		}
		return this
	}

	private internalRemove<Key extends keyof BaseEvents<T>>(event: Key, listener?: BaseEvents<T>[Key]): this {
		if (!listener) {
			for (const listener of (this.handlers[event] ?? [])) {
				this.internalRemove(event, listener)
			}
			return this
		}
		const listeners = this.listeners(event)
		const idx = listeners.indexOf(listener)
		if (idx >= 0) {
			this.handlers[event]?.splice(idx, 1)
		}
		// @ts-expect-error Meta Listener that emit when a event is removed
		this.emit('removeListener', event, listener)
		return this
	}
}
