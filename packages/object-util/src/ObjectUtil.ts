export type BasicObjectKeys = string | number | symbol
export type BasicObject<K extends BasicObjectKeys = BasicObjectKeys, V = any> = { [P in K]?: V }

/**
 * Remap an object to an array through a function
 *
 * (Same as Array.map but for objects)
 *
 * @param obj the object to remap
 * @param fn the function to run for each key: value pairs
 * @returns {Array} a new array filled with the object fn callback
 */
export function objectMap<T = any, J = any, K extends BasicObjectKeys = BasicObjectKeys>(
	obj: BasicObject<K, T>,
	fn: (value: T, key: K, index: number) => J
): Array<J> {
	mustBeObject(obj)
	const list: Array<J> = []
	objectLoop(obj, (item, key, index) => {
		list.push(fn(item, key, index))
	})
	return list
}

/**
 * a more advanced map function that transform an object back into another object
 *
 * note: if multiple key are the same only the last value will be set unless options.strict is enabled
 *
 * note2: for an array you will have to add manual typing to the `key` like this: `key: number`
 *
 * warn: the value is not a clone
 *
 * @param obj the object to remap (it will not be changed)
 * @param fn the function to run through
 * @param options optionnal options that change how the function works
 * @param options.strict (default: false) enabling this will throw an error if the same key is set twice
 * @returns a not deeply cloned object with it's key/values set from the [fn] function
 */
export function objectRemap<T = any, J extends BasicObject = BasicObject, K extends BasicObjectKeys = BasicObjectKeys>(
	obj: BasicObject<K, T>,
	fn: (value: T, key: K, index: number) => { key: keyof J, value: J[typeof key] },
	options?: { strict?: boolean }
): J {
	mustBeObject(obj)

	// create a clone
	const clone: J = {} as any

	// loop through each keys
	objectLoop(obj, (item, oldKey, index) => {
		const { key, value } = fn(item, oldKey, index)
		if (options?.strict && key in clone) {
			throw new Error('objectRemap strict mode active, you can\'t remap the same key twice')
		}

		// set new key pair into the clone
		clone[key] = value
	})
	return clone
}

/**
 * Loop through the object
 *
 * @param obj the object to loop through
 * @param fn the function to run for each childs if the function return `false` it will stop
 * @returns {boolean} return if the loop finished or ended early
 */
export function objectLoop<T = any, K extends BasicObjectKeys = BasicObjectKeys>(
	obj: BasicObject<K, T>,
	fn: (value: T, key: K, index: number) => boolean | void
): boolean {
	mustBeObject(obj)

	// get the object keys
	const keys = objectKeys(obj)

	// loop trough each keys
	for (let index = 0; index < keys.length; index++) {
		const key = keys[index]
		const stop = fn(obj[key] as T, key as K, index)
		if (stop === false) {
			return false
		}
	}
	return true
}

/**
 * Transform an object to an array of its values
 *
 * @param obj the object to transform
 * @returns {Array} an array containing the object's values
 */
export function objectValues<T = any>(obj: BasicObject<BasicObjectKeys, T>): Array<T> {
	mustBeObject(obj)
	return Object.values(obj) as Array<T>
}

/**
 * @deprecated use `objectValues`
 */
export function objectToArray<T = any>(obj: BasicObject<BasicObjectKeys, T>): Array<T> {
	mustBeObject(obj)
	return objectValues(obj)
}

/**
 * return the keys of the object
 *
 * @param obj the object
 * @returns {Array} an array containing the object's keys
 */
export function objectKeys<K extends BasicObjectKeys = BasicObjectKeys>(obj: BasicObject<K>): Array<K> {
	mustBeObject(obj)

	// Handle arrays
	if (Array.isArray(obj)) {
		return Array.from(obj.keys()) as Array<K>
	}
	return Object.keys(obj) as Array<K>
}

/**
 * return the length of an object
 *
 * @param obj the object
 * @returns {number} the object's size
 */
export function objectSize(obj: BasicObject): number {
	return objectKeys(obj).length
}

/**
 * Sort an object by its keys
 *
 * Same as Array.sort but for objects
 *
 * @param obj the object to sort
 * @param fn (Optionnal) the function to run to sort
 * @returns a new object with the keys sorted using the fn
 */
export function objectSort<T extends BasicObject>(
	obj: T,
	fn?: Array<keyof T> | ((a: keyof T, b: keyof T) => number)
): T {
	mustBeObject(obj)
	const ordered: any = {}
	let sortedKeys: Array<keyof T> = []
	if (Array.isArray(fn)) {
		sortedKeys = fn.concat(objectKeys(obj).filter((key) => !fn.includes(key)))
	} else {
		sortedKeys = objectKeys(obj).sort(fn)
	}
	for (const key of sortedKeys) {
		ordered[key] = obj[key]
	}
	return ordered
}

/**
 * @deprecated use `objectClone`
 */
export function cloneObject<T extends BasicObject>(obj: T): T {
	return objectClone(obj)
}

/**
 * Deeply clone an object
 *
 * @param obj the object to clone
 * @param options Cloning options
 * @param options.deep (Default: true) deeply clone the object
 * @returns the clone of the object
 */
export function objectClone<T extends BasicObject>(obj: T, options?: { deep?: boolean }): T {
	mustBeObject(obj)
	if (Array.isArray(obj)) {
		const arr: Array<any> = []
		for (const item of obj) {
			arr.push(
				isObject(item) ? objectClone(item) : item
			)
		}
		return arr as unknown as T
	}
	const clone: Partial<T> = {}
	objectLoop(obj, (value, key) => {
		if (typeof value === 'object' && value != null && (typeof options?.deep === 'undefined' || options.deep)) {
			clone[key as Extract<keyof T, string>] = objectClone(value)
			return
		}
		clone[key as Extract<keyof T, string>] = value
	})
	return clone as T
}

/**
 * deeply set the value at the path given
 *
 * (Create sub object/array if not made depending on path type (number = Array, string = Object))
 *
 * _NOTE: it is way quicker to use `obj[path][path]... = value` when possible_
 *
 * @param obj the object to set the value
 * @param path the path
 * @param value the value
 */
export function objectSet(obj: BasicObject, path: Array<BasicObjectKeys>, value: any): void {
	mustBeObject(obj)
	let pointer = obj
	for (let index = 0; index < path.length; index++) {
		const key = path[index]
		const nextIndex = index + 1
		if (!Object.prototype.hasOwnProperty.call(pointer, key) && nextIndex < path.length) {
			const key1 = path[nextIndex]
			if (typeof key1 === 'number') {
				pointer[key] = []
			} else {
				pointer[key] = {}
			}
		}

		// if last index
		if (nextIndex === path.length) {
			pointer[key] = value
			if (value === undefined) {
				delete pointer[key]
			}
			break
		}

		// move pointer to new key
		pointer = pointer[key]
	}
}

/**
 * deeply compare objects and return if they are equal or not
 *
 * @param first the first object
 * @param second the second object
 * @returns {boolean} a boolean representing the equality of the two objects
 */
export function objectEqual(first: BasicObject, second: BasicObject): boolean {
	mustBeObject(first)
	mustBeObject(second)
	if (objectSize(first) !== objectSize(second)) {
		return false
	}
	const res = objectLoop(first, (item, key) => {
		if (!(key in second) && key in first) {
			return false
		}
		const item2 = second[key]
		if (item === null && item2 === null) {
			return true
		}
		if (typeof item === 'object' && typeof item2 === 'object') {
			return objectEqual(item, item2)
		}
		return item === item2
	})
	return res
}

/**
 * Deeply clean an object from having `undefined`,`null` and/or flasy values (options to enable)
 *
 * @param obj the object to clean
 * @param options cleanup options
 * @param {boolean?} options.cleanUndefined (default: true) clean undefined from the object
 * @param {boolean?} options.cleanFalsy (default: false) clean falsy values (including undefined and null) from the object see https://developer.mozilla.org/en-US/docs/Glossary/Falsy
 * @param {boolean?} options.cleanNull (default: false) clean null from the object
 * @param {boolean?} options.deep (default: true) deeply clean the object
 */
export function objectClean(obj: BasicObject, options?: { cleanUndefined?: boolean, cleanNull?: boolean, cleanFalsy?: boolean, deep?: boolean }): void {
	mustBeObject(obj)
	objectLoop(obj, (item, key) => {
		if ((typeof options?.cleanUndefined === 'undefined' || options.cleanUndefined) && item === undefined) {
			delete obj[key] // clean undefined values
		} else if (options?.cleanFalsy && !obj[key]) {
			delete obj[key] // clean falsy values
		} else if (options?.cleanNull && item === null) {
			delete obj[key] // clean null values
		}

		// deeply clean the object
		if ((typeof options?.deep === 'undefined' || options.deep) && isObject(item)) {
			objectClean(item, options)
		}
	})
}

/**
 * return a new object containing only not the keys defined
 *
 * note: clone is not deep
 *
 * @param obj the object to clone
 * @param keys the keys to emit
 * @returns the cloned object
 */
export function objectOmit<T extends BasicObject>(obj: T, ...keys: Array<string | number>): T {
	const cloned = objectClone(obj, { deep: false })
	for (const key of keys) {
		if (key in cloned) {
			delete cloned[key]
		}
	}
	return cloned
}

/**
 * find an element in an object
 *
 * @param obj the object to find within
 * @param fn the function that find the object
 * @returns the key, value, index of the element found or undefined
 */
export function objectFind<T = any, K extends BasicObjectKeys = BasicObjectKeys>(
	obj: BasicObject<K, T>,
	fn: (value: T, key: K, index: number) => boolean
): { key: K, value: T } | undefined {
	mustBeObject(obj)
	let res: { key: K, value: T, index: number } | undefined = undefined
	objectLoop(obj, (value, key, index) => {
		const tmp = fn(value, key, index)
		if (tmp) {
			res = {
				key, value, index
			}
		}
		return !tmp
	})
	return res
}

/**
 * go through an object to get a specific value
 *
 * note: it will be slower than getting it directly (ex: `obj['pouet']`)
 *
 * @param obj the object to go through
 * @param {Array<string | number | symbol> | string} path the path to follow (if path is a string it will be splitted with `.` and ints will be parsed)
 *
 * @returns the value if found or undefined if it was not found
 */
export function objectGet<T = any>(obj: any, path: Array<string | number | symbol> | string): T | undefined {
	// if path is not defined or path is empty return the current object
	if (!path || path === '' || Array.isArray(path) && path.length === 0) {
		return obj as T
	}

	mustBeObject(obj)

	// transform path into an Array
	if (typeof path === 'string') {
		path = path.split('.').map((it) => /^\d+$/g.test(it) ? Number.parseInt(it) : it)
	}

	// the pointer
	let pointer: object = obj

	// loop through each keys
	for (let index = 0; index < path.length; index++) {
		const key = path[index]
		const nextIndex = index + 1;

		// handle key being undefined or pointer not having key and not the last key
		if (typeof key === 'undefined' || !Object.prototype.hasOwnProperty.call(pointer, key) && nextIndex < path.length) {
			return undefined
		}

		// if last index
		if (nextIndex === path.length) {
			return (pointer as any)[key] as T
		}

		// move pointer to new key
		pointer = (pointer as any)[key]
	}

	throw new Error(`it should never get there ! (${JSON.stringify(obj)}, ${path}, ${JSON.stringify(pointer)})`)
}

/**
 * Only return the specified keys from the object
 *
 * @param obj the object to pick from
 * @param keys the keys to keep
 * @returns a new copy of `obj` with only `keys` in it
 */
function objectPick<V, K extends string | number | symbol>(obj: Record<K, V>, ...keys: Array<K>): Pick<Record<K, V>, K> {
	mustBeObject(obj)
	return objectFilter(obj, (_, k) => keys.includes(k)) as Pick<Record<K, V>, K>
}

/**
 * filter elements from the object and return a new copy
 *
 * @param obj the object to filter
 * @param fn the function to pass it through
 * @returns the filtered object
 */
function objectFilter<V, K extends string | number | symbol>(obj: Record<K, V>, fn: (v: V, k: K, idx: number) => boolean): Partial<Record<K, V>> {
	mustBeObject(obj)
	const clone: Partial<Record<K, V>> = {}
	objectLoop(obj, (v, k, idx) => {
		const res = fn(v, k, idx)
		if (res) {
			clone[k] = v
		}
	})

	return clone
}


/**
 * return if an item is an object
 *
 * @param item the item to check
 * @returns {boolean} the item is an object
 */
export function isObject(item: any): item is BasicObject {
	return typeof item === 'object' && item !== null
}

/**
 * Strict check for an object
 *
 * throw an error is the item is not an item
 *
 * @param item the item to check
 * @returns {boolean} true is the item is an object, else throw an error
 */
export function mustBeObject(item: any): item is BasicObject {
	if (!isObject(item)) {
		throw new Error('Input is not an object!')
	}
	return true
}

export default {
	objectClean,
	objectClone,
	objectEqual,
	objectFilter,
	objectFind,
	objectGet,
	objectKeys,
	objectLoop,
	objectMap,
	objectOmit,
	objectPick,
	objectRemap,
	objectSet,
	objectSize,
	objectSort,

	// helpers
	isObject,
	mustBeObject,

	// deprecated
	objectToArray,
	cloneObject,
}
