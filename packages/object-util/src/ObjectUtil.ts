/**
 * Remap an object to an array through a function
 *
 * (Same as Array.map)
 * @param obj the object to remap
 * @param fn the fn to run
 */
export function objectMap<T = any, J = any>(obj: Record<string, T>, fn: (value: T, key: string) => J): Array<J> {
	const list: Array<J> = []
	objectLoop(obj, (item, key) => {
		list.push(fn(item, key))
	})
	return list
}

/**
 * Loop through the object
 * @param obj the object to loop through
 * @param fn the function to run for each childs
 */
export function objectLoop<T = any>(obj: Record<string, T>, fn: (value: T, key: string) => boolean | void): boolean {
	for (const key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) {
			continue
		}
		const stop = fn(obj[key], key)
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
export function objectToArray<T = any>(obj: Record<string, T>): Array<T> {
	return Object.values(obj)
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
export function objectSort<T = Record<string, any>>(
	obj: Record<string, any>,
	fn?: (a: string, b: string) => number
): T {
	const ordered: any = {}
	for (const key of objectKeys(obj).sort(fn)) {
		ordered[key] = obj[key]
	}
	return ordered
}

/**
 * Deeply clone an object
 * @param obj the object to clone
 * @deprecated Replace with objectClone
 */
export function cloneObject<T = Record<string, any>>(obj: T): T {
	return objectClone(obj)
}

/**
 * Deeply clone an object
 * @param obj the object to clone
 */
export function objectClone<T = Record<string, any>>(obj: T): T {
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
