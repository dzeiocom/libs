export type BasicObjectKeys = string | number | symbol
export type BasicObject<K extends BasicObjectKeys = BasicObjectKeys, V = any> = { [P in K]?: V }

/**
 * Remap an object to an array through a function
 *
 * (Same as Array.map but for objects)
 *
 * @param obj the object to remap
 * @param fn the function to run for each key: value pairs
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
 * Loop through the object
 *
 * @param obj the object to loop through
 * @param fn the function to run for each childs if the function return `false` it will stop
 */
export function objectLoop<T = any, K extends BasicObjectKeys = BasicObjectKeys>(
	obj: BasicObject<K, T>,
	fn: (value: T, key: K, index: number) => boolean | void
): boolean {
	mustBeObject(obj)
	const keys = objectKeys(obj)
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
export function objectClone<T extends BasicObject>(obj: T, options?: {deep?: boolean}): T {
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
 * deeply clean an object from having {key: undefined}
 *
 * @param obj the object to clean
 * @param {boolean?} options.cleanUndefined (default: true) clean undefined from the object
 * @param {boolean?} options.cleanNull clean null from the object
 * @param {boolean?} options.deep (default: true) deeply clean the object
 */
export function objectClean(obj: BasicObject, options?: {cleanUndefined?: boolean, cleanNull?: boolean, deep?: boolean}): void {
	mustBeObject(obj)
	objectLoop(obj, (item, key) => {
		if ((typeof options?.cleanUndefined === 'undefined' || options?.cleanUndefined) && item === undefined) {
			delete obj[key]
		}

		if (options?.cleanNull && item === null) {
			delete obj[key]
		}

		if ((typeof options?.deep === 'undefined' || options?.deep) && isObject(item)) {
			return objectClean(item, options)
		}
	})
}

/**
 * clone the object (not deeply) and emit some keys from cloning
 *
 * @param obj the object to clone
 * @param keys the keys to emit
 * @returns the cloned object
 */
export function objectOmit<T extends BasicObject>(obj: T, ...keys: Array<string>): T {
	const cloned = objectClone(obj, {deep: false})
	for (const key of keys) {
		if (key in cloned) {
			delete cloned[key]
		}
	}
	return cloned
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
 * @param item the item to check
 * @returns {boolean} throw an error is the item is not an item
 */
export function mustBeObject(item: any): item is BasicObject {
	if (isObject(item)) {
		return true
	} else {
		throw new Error('Input is not an object!')
	}
}

export default {
	objectMap,
	objectLoop,
	objectToArray,
	objectKeys,
	objectSize,
	objectSort,
	cloneObject,
	objectClone,
	objectSet,
	objectEqual,
	objectClean,
	objectOmit,
	isObject,
	mustBeObject
}
