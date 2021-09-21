/**
 * Remap an object to an array through a function
 *
 * (Same as Array.map)
 * @param obj the object to remap
 * @param fn the function to run for each key: value pairs
 */
export function objectMap<T = any, J = any>(
	obj: Record<string, T>,
	fn: (value: T, key: string, index: number) => J
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
 * @param obj the object to loop through
 * @param fn the function to run for each childs
 */
export function objectLoop<T = any>(
	obj: Record<string, T>,
	fn: (value: T, key: string, index: number) => boolean | void
): boolean {
	mustBeObject(obj)
	const keys = objectKeys(obj)
	for (let index = 0; index < keys.length; index++) {
		const key = keys[index]
		const stop = fn(obj[key], key, index)
		if (stop === false) {
			return false
		}
	}
	return true
}

/**
 * Transform an object to an array removing the keys
 * @param obj the object to transform
 */
export function objectValues<T = any>(obj: Record<string, T>): Array<T> {
	mustBeObject(obj)
	return Object.values(obj)
}

/**
 * @deprecated use `objectValues`
 */
export function objectToArray<T = any>(obj: Record<string, T>): Array<T> {
	mustBeObject(obj)
	return objectValues(obj)
}

/**
 * return the keys of th object
 * @param obj the object
 */
export function objectKeys(obj: Record<string, any>): Array<string> {
	mustBeObject(obj)
	return Object.keys(obj)
}

/**
 * return the length of an object
 * @param obj the object
 */
export function objectSize(obj: Record<string, any>): number {
	mustBeObject(obj)
	return objectKeys(obj).length
}

/**
 * Sort an object by its keys
 *
 * Same as Array.sort
 * @param obj the object to sort
 * @param fn (Optionnal) the function to run to sort
 */
export function objectSort<T extends Record<string, any> = Record<string, any>>(
	obj: T,
	fn?: Array<keyof T> | ((a: keyof T, b: keyof T) => number)
): T {
	mustBeObject(obj)
	const ordered: any = {}
	let sortedKeys: Array<keyof T> = []
	if (Array.isArray(fn)) {
		sortedKeys = fn.concat(objectKeys(obj).filter((k) => !fn.includes(k)))
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
export function cloneObject<T = Record<string, any>>(obj: T): T {
	mustBeObject(obj)
	return objectClone(obj)
}

/**
 * Deeply clone an object
 * @param obj the object to clone
 */
export function objectClone<T = Record<string, any>>(obj: T): T {
	mustBeObject(obj)
	if (Array.isArray(obj)) {
		const arr: Array<any> = []
		for (const item of obj) {
			if (isObject(item)) {
				arr.push(objectClone(item))
			} else {
				arr.push(item)
			}
		}
		return arr as unknown as T
	}
	const clone: Partial<T> = {}
	objectLoop(obj, (value, key) => {
		if (typeof value === 'object' && value != null) {
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
 * (Create sub object/array if not made)
 *
 * _NOTE: it is way quicker to use obj[path][path]... = value_
 * @param obj the object to set the value
 * @param path the path
 * @param value the value
 */
export function objectSet(obj: Record<string, any>, path: Array<string | number>, value: any): void {
	mustBeObject(obj)
	let pointer = obj
	for (let index = 0; index < path.length; index++) {
		const key = path[index]
		if ((!Object.prototype.hasOwnProperty.call(pointer, key)) && (index+1) < path.length) {
			const key1 = path[index + 1]
			if (typeof key1 === 'number') {
				pointer[key] = []
			} else {
				pointer[key] = {}
			}
		}

		// if last index
		if ((index+1) === path.length) {
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
 * @param x the first object
 * @param y the second object
 */
export function objectEqual(x: Record<string, any>, y: Record<string, any>): boolean {
	mustBeObject(x)
	mustBeObject(y)
	if (objectSize(x) !== objectSize(y)) {
		return false
	}
	const res = objectLoop(x, (item, key) => {
		if (!(key in y)) {
			return false
		}
		const item2 = y[key]
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
 * deeply compare objects and return if they are equal or not
 * @param x the first object
 * @param y the second object
 */
export function objectClean(obj: Record<string, any>, options?: {cleanUndefined?: boolean, cleanNull?: boolean, deep?: boolean}): void {
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

export function isObject(item: any): item is Record<any, any> {
	return typeof item === 'object' && item !== null
}

function mustBeObject(item: any): item is Record<any, any> {
	if (isObject(item)) {
		return true
	} else {
		throw new Error("Input is not an object!")
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
	isObject
}
