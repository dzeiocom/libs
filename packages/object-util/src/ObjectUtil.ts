export const objectMap = <T = any, J = any>(items: Record<string, T>, fn: (el: T, key: string) => J) => {
	const list: Array<J> = []
	objectLoop(items, (item, key) => {
		list.push(fn(item, key))
	})
	return list
}

export const objectLoop = <T = any>(items: Record<string, T>, fn: (el: T, key: string) => void | boolean) => {
	let res: void | boolean
	for (const key in items) {
		if (!Object.prototype.hasOwnProperty.call(items, key)) {
			continue
		}
		res = fn(items[key], key)
		if (typeof res === 'boolean' && !res) {
			return res
		}
	}
	return res
}

export function objectToArray<T = any>(obj: Record<string, T>): Array<T> {
	return Object.values(obj)
}

export function objectSize(obj: Record<string, any>) {
	return Object.keys(obj).length
}

export function objectSort<T = Record<string, any>>(obj: Record<string, any>, fn?: (a: string, b: string) => number): T {
	const ordered: any = {};
	for (const key of Object.keys(obj).sort(fn)) {
		ordered[key] = obj[key]
	}
	return ordered
}

export function cloneObject<T = Record<string, any>>(obj: T): T {
	const clone: T = {} as any
	objectLoop(obj, (value, key) => {
		if (typeof value === 'object' && value != null) {
			clone[key as Extract<keyof T, string>] = cloneObject(value)
			return
		}
		clone[key as Extract<keyof T, string>] = value
	})
	return clone
}

export function objectSet(obj: Record<string, any>, path: Array<string | number>, value: any) {
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

export function objectEqual(x: Record<string, any>, y: Record<string, any>): boolean {
	const res = objectLoop(x, (item, key) => {
		if (!(key in y)) {
			return false
		}
		const item2 = y[key]
		if (typeof item === 'object' && typeof item2 === 'object') {
			return objectEqual(item, item2)
		}
		return item === item2
	})
	if (typeof res !== 'boolean') {
		return true
	}
	return res
}

export default {
	objectMap,
	objectLoop,
	objectToArray,
	objectSize,
	objectSort,
	cloneObject,
	objectSet,
	objectEqual
}
