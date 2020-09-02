import { DOMElement } from "."

export default class DOMFleetManager<T extends HTMLElement = HTMLElement> {
	public items: Array<DOMElement<T>> = []

	public constructor(
		private query: string,
		private source?: HTMLElement
	) {
		this.refresh()
	}

	public each(fn: (item: DOMElement, index: number) => void) {
		this.items.forEach((el, index) => fn(el, index))
	}

	public on<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions) {
		this.each((item) => item.on(type, listener, options))
	}

	public off<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void) {
		this.each((item) => item.off(type, listener))
	}

	public refresh() {
		this.items = []
		;(this.source || document).querySelectorAll<T>(this.query).forEach((item) => {
			const element = DOMElement.get<T>(item)
			if (!element) {
				return
			}
			this.items.push(
				element
			)
		})
	}

	public [Symbol.iterator]() {
		return this.items
	}
}
