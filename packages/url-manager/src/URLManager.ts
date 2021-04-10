/**
 * Easy URLs manager
 */
export default class URLManager {

	private _protocols: Array<string> = []
	private _username: string | undefined
	private _password: string | undefined
	private _domain: string | undefined
	private _port: number | undefined
	private _path: string | undefined
	private _query: Record<string, string | Array<string> | undefined> = {}
	private _hash: string | undefined

	/**
	 * Initialize the Manager
	 *
	 * @param { string | URLSearchParams | URL } url the url to start from
	 */
	public constructor(url?: string | URLSearchParams | URL | Location) {
		if (!url) {
			return
		}
		if (url instanceof URLSearchParams) {
			url.forEach((value, key) => {
				this.query(key, value)
			})
			return
		}
		this.fromURL(`${url}`)
	}

	/**
	 * Make a new URLManager from the current location
	 * @return { this }
	 * @deprecated use `new URLManager(window.location)`
	 */
	public static fromLocation() {
		return new URLManager(window.location)
	}

	/**
	 * Reload the window
	 * @deprecated use `window.location.reload()`
	 */
	public static reload() {
		window.location.reload()
	}

	/**
	 * return a `key: value` object of the query string
	 */
	public query(): Record<string, string | Array<string>>

	/**
	 * get a value from the query string
	 * @param key the key to get the value from
	 */
	public query(key: string): string | Array<string> | undefined

	/**
	 * set/delete a key to a value in the query string
	 * @param key the key to set/delete
	 * @param value the value to set or null to delete it
	 */
	public query(key: string, value: string | Array<string> | null): this

	/**
	 * Manipulate the query string
	 * @param { string | undefined } key the key to manipulate (is not set return a list of key-value pair)
	 * @param { string | Array<string> | null | undefined } value the value to set or action to run (if not set it returns the value)
	 * @return { this | string | Array<string> | undefined }
	 */
	public query(key?: string, value?: string | Array<string> | null) {
		if (!key) {
			return this._query
		}
		if (typeof value === 'undefined') {
			return this._query[key]
		}
		if (value === null) {
			delete this._query[key]
		} else {
			this._query[key] = value
		}
		return this
	}

	/**
	 * Get the url path
	 */
	public path(): string | undefined

	/**
	 * Set the url path
	 * @param val the path to set
	 */
	public path(val: string): this

	/**
	 * Manipulate the url path
	 * @param { string | undefined } val the path to set
	 * @return { URLManager | string } erer
	 */
	public path(val?: string) {
		if (!val) {
			return this._path
		}
		this._path = val
		return this
	}

	/**
	 * Get the list of protocols
	 */
	public protocols(): Array<string>

	/**
	 * set the list of protocols
	 * @param val the list
	 */
	public protocols(val: Array<string>): this

	/**
	 * Manipulate the list of protocols
	 * @param { Array<string> | undefined } val the list of protocols to set
	 * @return { Array<string> }
	 */
	public protocols(val?: Array<string>) {
		if (!val) {
			return this._protocols
		}
		this._protocols = val
		return this
	}

	/**
	 * Get the url protocol
	 */
	public protocol(): string | undefined

	/**
	 * Set the url protocol
	 * @param val the protocol to set
	 */
	public protocol(val: string): this

	/**
	 * Manipulate the url protocol
	 * @param { string | undefined } val the protocol to set (Optionnal)
	 * @return { string }
	 */
	public protocol(val?: string) {
		if (!val) {
			return this._protocols.length > 0 ? this._protocols[0] : undefined
		}
		this._protocols = [val]
		return this
	}

	/**
	 * Get the url Domain
	 */
	public domain(): string | undefined

	/**
	 * set the url domain name
	 * @param val the domain name
	 */
	public domain(val: string): this

	/**
	 * Manipulate the url domain
	 * @param { string | undefined } val the url domain (Optionnal)
	 * @return { string | this }
	 */
	public domain(val?: string) {
		if (!val) {
			return this._domain
		}
		this._domain = val
		return this
	}

	/**
	 * Get the url username
	 */
	public username(): string | undefined

	/**
	 * Set the url username
	 * @param val the url username
	 */
	public username(val: string): this

	/**
	 * Manipulate the url username
	 * @param {string | undefined } val the username to set (Optionnal)
	 * @return { string | undefined }
	 */
	public username(val?: string) {
		if (!val) {
			return this._username
		}
		this._username = val
		return this
	}

	/**
	 * Get the url password
	 */
	public password(): string | undefined

	/**
	 * Set the url password
	 * @param val the password
	 */
	public password(val: string): this

	/**
	 * Manipulate the url password
	 * @param { string | undefinel } val the password (Optionnal)
	 * @return { string | this }
	 */
	public password(val?: string) {
		if (!val) {
			return this._password
		}
		this._password = val
		return this
	}

	public port(): number | undefined
	public port(val: number): this
	public port(val?: number | undefined) {
		if (!val) {
			return this._port
		}
		this._port = val
		return this
	}

	public hash(): string | undefined
	public hash(val: string): this
	public hash(val?: string) {
		if (!val) {
			return this._hash
		}
		this._hash = val
		return this
	}

	/**
	 * Build the string back
	 * @param { Record<string, string> | undefined } format Formatting options ex: if path contains `[test]` and format is `{test: 'working'}` `[test]` will be replaced by the value
	 * @param { Record<string, string> | undefined } options options for formatting
	 * @param { string | undefined } options.queryArrayJoin Query formatting
	 * @return { string } return the builded string
	 */
	public toString(format?: Record<string, string>, options?: {queryArrayJoin?: string}): string {

		let result = ''

		const protocols = this.protocols()
		if (protocols.length > 0) {
			result += `${protocols.join('+')}://`
		}

		const user = this.username()
		const pass = this.password()
		if (user) {
			result += user
			if (pass) {
				result += `:${pass}`
			}
			result += '@'
		}

		result += this.domain() || ''

		const port = this.port()
		if (port) {
			result += `:${port}`
		}

		result += this.formatPath(format) || ''

		result += this.formatQuery(options) || ''

		const hash = this.hash()
		if (hash) {
			result += `#${hash}`
		}

		return result
	}

	/**
	 * Go to the page built
	 * @param {boolean} reload is normal push or history only push
	 * @deprecated use `window.location.href = url.toString()` or `window.history.pushState(undefined, document.head.title, url.toString())`
	 */
	public go(reload = true) {
		if (reload) {
			window.location.href = this.toString()
			return
		}
		window.history.pushState(undefined, document.head.title, this.toString())
	}

	private formatPath(format?: Record<string, string>) {
		let path = this.path()
		if (!path) {
			return undefined
		}
		if (format) {
			for (const key in format) {
				if (!(key in format)) {
					continue
				}
				const replacing = format[key]
				path = path.replace(`[${key}]`, replacing)
			}
		}
		return `${(path.startsWith('/') ? '' : '/')}${path}`
	}

	private formatQuery(options?: { queryArrayJoin?: string }) {
		let result = ''
		const queryTmp = this.query()

		for (const key in queryTmp) {
			if (!Object.prototype.hasOwnProperty.call(queryTmp, key)) {
				continue
			}

			const element = queryTmp[key]

			result += result.length === 0 ? '?' : '&'

			if (typeof element !== 'object') {
				result += `${key}=${element}`
				continue
			}

			if (options?.queryArrayJoin) {
				result += `${key}=${element.join(options.queryArrayJoin)}`
				continue
			}

			for (let i = 0; i < element.length; i++) {
				const val = element[i]
				if (i !== 0) {
					result += '&'
				}
				result += `${key}=${val}`
			}
		}

		if (!result) {
			return undefined
		}

		return result
	}

	private fromURL(url: string) {
		const protocolIndex = url.indexOf('://')
		let indexOfPath = url.indexOf('/', protocolIndex !== -1 ? protocolIndex + 3 : undefined)
		if (indexOfPath === -1) {
			indexOfPath = url.indexOf('?', protocolIndex !== -1 ? protocolIndex + 3 : undefined)
		}
		if (indexOfPath === -1) {
			indexOfPath = url.indexOf('#', protocolIndex !== -1 ? protocolIndex + 3 : undefined)
		}
		const firstPart = url.substr(0, indexOfPath !== -1 ? indexOfPath : undefined)
		const path = url.substr(firstPart.length)

		// PROTOCOL
		const procotolSplit = firstPart.split('://')
		if (procotolSplit.length === 2) {
			this.protocols(procotolSplit[0].split('+'))
		}

		// USERNAME and PASSWORD
		const usrSplit = url.split('@')
		if (usrSplit.length === 2) {
			const usrPass = usrSplit[0].substr(protocolIndex !== -1 ? protocolIndex + 3 : 0)
			const arr = usrPass.split(':')
			this.username(arr.shift() as string)
			if (arr.length >= 1) {
				this.password(arr.join(':'))
			}
		}

		// DOMAIN & PORT
		let splitted = firstPart.split('@')
		if (splitted.length === 1) {
			splitted = firstPart.split('://')
		}
		const post = splitted.length > 1 ? splitted[1] : splitted[0]
		const data = post.split(':')
		this.domain(data[0])
		if (data.length === 2) {
			this.port(parseInt(data[1]))
		}

		const hashPos = path.indexOf('#')
		const queryStart = path.indexOf('?')

		// PATH
		const pathEnd = queryStart !== -1 ? queryStart : hashPos
		this.path(path.substr(0, pathEnd !== -1 ? pathEnd : undefined))

		// QUERY
		if (queryStart !== -1) {
			const queryString = path.substring(queryStart + 1, hashPos !== -1 ? hashPos : undefined)
			const queryArray = queryString.split('&')
			for (const queryItem of queryArray) {
				const item = queryItem.split('=')
				const key = item[0]
				const val = item.length === 2 ? item[1] : ''

				let query = this.query(key)
				if (query) {
					if (typeof query === 'string') {
						query = [query, val]
					} else {
						query.push(val)
					}
					this.query(key, query)
				} else {
					this.query(key, val)
				}
			}
		}

		// HASH
		if (hashPos !== -1) {
			this.hash(path.substr(hashPos + 1))
		}
	}

}
