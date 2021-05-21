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
	return Object.values(obj)
}

/**
 * @deprecated use `objectValues`
 */
export function objectToArray<T = any>(obj: Record<string, T>): Array<T> {
	return objectValues(obj)
}

/**
 * return the keys of th object
 * @param obj the object
 */
export function objectKeys(obj: Record<string, any>): Array<string> {
	return Object.keys(obj)
}

/**
 * return the length of an object
 * @param obj the object
 */
export function objectSize(obj: Record<string, any>): number {
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
	return objectClone(obj)
}

/**
 * Deeply clone an object
 * @param obj the object to clone
 */
export function objectClone<T = Record<string, any>>(obj: T): T {
	if (typeof obj !== 'object') {
		const v = obj
		return v
	}
	if (Array.isArray(obj)) {
		const arr: Array<any> = []
		for (const item of obj) {
			arr.push(objectClone(item))
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
	objectEqual
}
