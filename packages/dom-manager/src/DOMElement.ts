type Tags = keyof HTMLElementTagNameMap

export default class DOMElement<T extends HTMLElement = HTMLElement> {

	public item: T

	public constructor(tagName: Tags | T, options?: ElementCreationOptions) {
		if (tagName instanceof HTMLElement) {
			this.item = tagName
			return
		}
		this.item = document.createElement(tagName, options) as any
	}

	public static create<K extends Tags>(tagName: K, options?: ElementCreationOptions): DOMElement<HTMLElementTagNameMap[K]>;
	public static create(tagName: string, options?: ElementCreationOptions): DOMElement<HTMLElement> {
		return new DOMElement(tagName as Tags, options)
	}


	public static get<T extends HTMLElement = HTMLElement>(query: string | T, source?: HTMLElement | DOMElement): DOMElement<T> | undefined {
		if (!(query instanceof HTMLElement)) {
			const tmp = (source instanceof DOMElement ? source.item : source || document).querySelector<T>(query)
			if (!tmp) {
				return undefined
			}
			return new DOMElement(tmp)
		}
		return new DOMElement(query)
	}

	public on<K extends keyof HTMLElementEventMap>(type: K, listener: (this: T, ev: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions): this
	public on(type: string, listener: (this: T, ev: Event) => void, options?: boolean | AddEventListenerOptions): this
	public on(type: string, listener: (this: T, ev: Event) => void, options?: boolean | AddEventListenerOptions) {
		this.item.addEventListener(type, listener, options)
		return this
	}

	public off<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void) {
		this.item.removeEventListener(type, listener)
		return this
	}

	public text(): string
	public text(val: string): this
	public text(val?: string) {
		if (val) {
			this.item.innerText = val
			return this
		}
		return this.item.innerText
	}

	public html(): string
	public html(val: string): this
	public html(val?: string) {
		if (val) {
			this.item.innerHTML = val
			return this
		}
		return this.item.innerText
	}

	public addClass(...classes: Array<string>) {
		this.item.classList.add(...classes)
		return this
	}

	public setClass(...classes: Array<string>) {
		this.item.classList.forEach((cls) => {
			if (!classes.includes(cls)) {
				this.item.classList.remove(cls)
			}
		})
		this.addClass(...classes)
		return this
	}

	public classList(...classes: Array<string>): this
	public classList(): Array<string>
	public classList(...classes: Array<string>) {
		if (!classes) {
			const res: Array<string> = []
			this.item.classList.forEach((el) => res.push(el))
			return res
		}
		return this.setClass(...classes)
	}

	public toggleClass(...classes: Array<string>) {
		for (const classe of classes) {
			this.item.classList.toggle(classe)
		}
		return this
	}

	public removeClass(...classes: Array<string>) {
		this.item.classList.remove(...classes)
		return this
	}

	public emit<E extends keyof HTMLElementEventMap>(event: E): this
	public emit(event: string): this
	public emit(event: string): this {
		if (event in this.item) {
			(this.item as any)[event]()
			return this
		}
		this.item.dispatchEvent(new Event(event))
		return this
	}

	public attr(key: string): string | null
	public attr(key: string, value: string | null): this
	public attr(key: keyof T, value: boolean): this
	public attr(key: string | keyof T, value?: string | boolean | null): this | string | null {
		if (!value) {
			return this.item.getAttribute(key as string)
		}
		if (value === null) {
			this.item.removeAttribute(key as string)
			return this
		}
		if (typeof value === 'boolean') {
			this.item[key as 'draggable'] = value
			return this
		}
		this.item.setAttribute(key as string, value)
		return this
	}


	public data(key: string): string | null
	public data(key: string, value: string | null): this
	public data(key: string, value?: string | null): this | string | null {
		// @ts-ignore
		return this.attr(`data-${key}`, value)
	}

	public style(key: string, value?: string | number) {
		if (typeof value === 'undefined') {
			return this.item.style[key as any]
		}
		this.item.style[key as any] = value as string
		return this
	}

	public exist() {
		return !!this.item
	}

	public placeBefore(item: DOMElement | HTMLElement) {
		if (item instanceof DOMElement) {
			item = item.item
		}
		const parent = item.parentElement
		if (!parent) {
			throw new Error('can\'t place DOMElement before item because it has no parent')
		}
		parent.insertBefore(this.item, item)
		return this
	}

	public placeAsChildOf(item: DOMElement | HTMLElement) {
		if (item instanceof DOMElement) {
			item = item.item
		}

		item.appendChild(this.item)
		return this
	}

	public place(verb: 'before' | 'asChildOf', item: DOMElement | HTMLElement) {
		if (verb === 'before') {
			return this.placeBefore(item)
		} else {
			return this.placeAsChildOf(item)
		}
	}
}
