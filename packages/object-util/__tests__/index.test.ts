/// <reference types="jest" />

import { isObject, objectClean, objectClone, objectEqual, objectKeys, objectLoop, objectMap, objectOmit, objectRemap, objectSet, objectSize, objectSort, objectValues } from '../src/ObjectUtil'

describe('Throw if parameter is not an object', () => {
	it('should works', () => {
		expect(objectKeys).toThrow()
	})
})

describe('Object Map tests', () => {
	it('should works', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		expect(objectMap(obj, (value, index) => {
			return [index, value]
		})).toEqual([['pouet', 'first'],['toto','second']])
	})

	it('should works on arrays', () => {
		const obj = [
			'first',
			'second'
		]
		expect(objectMap(obj, (value, index) => {
			return [index, value]
		})).toEqual([[0, 'first'],[1, 'second']])
	})
})

describe('Object Loop Tests', () => {
	it('Should works', () => {
		const obj = {
			pouet: true,
			toto: 'object-util'
		}
		objectLoop(obj, (value, key) => {
			if (key === 'pouet') {
				expect(value).toBe(true)
			} else if (key === 'toto') {
				expect(value).toBe('object-util')
			} else {
				throw "it should not come here"
			}
		})

	})

	it('should work on arrays', () => {
		const obj = [
			true,
			'object-util'
		]
		objectLoop(obj, (value, key) => {
			if (key === 0) {
				expect(value).toBe(true)
			} else if (key === 1) {
				expect(value).toBe('object-util')
			} else {
				throw "it should not come here"
			}
		})

	})

	it('Should return false', () => {
		const obj = {
			pouet: true
		}
		expect(objectLoop(obj, () => {
			return false
		})).toBe(false)
		// TO BE EXPECTED in MAJOR change
		// expect(objectLoop(obj, () => {
		// 	return undefined
		// })).toBe(false)

	})

	it('Should return true', () => {
		const obj = {
			pouet: true
		}
		expect(objectLoop(obj, () => {
			return true
		})).toBe(true)
		// TO BE EXPECTED until major change
		expect(objectLoop(obj, () => {
			return undefined
		})).toBe(true)

	})
})

describe('Object To Array Tests', () => {
	it('Should Works', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		expect(objectValues(obj)).toEqual(['first', 'second'])
	})
	// it('shoud work on arrays', () => {
	// 	const obj = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
	// 	expect(objectValues(obj)).toEqual(obj)
	// })
})

describe('Object Keys Tests', () => {
	it('Should work on objects', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		expect(objectKeys(obj)).toEqual(['pouet', 'toto'])
	})
	it('shoud work on arrays', () => {
		const obj = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		expect(objectKeys(obj)).toEqual(obj)
	})
})

describe('Object Size Tests', () => {
	it('shoud return length of an object', () => {
		const obj = {
			index0: true,
			index1: false,
			index2: false,
			index3: false,
			index4: false,
			index5: false,
			index6: false,
			index7: false,
			index8: false,
			index9: false,
			index10: false
		}
		expect(objectSize(obj)).toBe(11)
	})
	it('shoud return length of an array', () => {
		const obj = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		expect(objectSize(obj)).toBe(10)
	})
})

describe('Object sort Tests', () => {
	it('should sort the object', () => {
		const obj = {
			b: 'first',
			a: 'second'
		}
		expect(objectSort(obj)).toEqual({
			a: 'second',
			b: 'first'
		})
	})
	// it('should sort an array (yes stupid)', () => {
	// 	const arr = [2, 1, 0]
	// 	expect(objectSort(arr, (a, b) => a - b)).toEqual([0, 1, 2])
	// })
	it('should sort by the specified key', () => {
		const obj = {
			b: 'first',
			a: 'second',
			c: 'zero',
			d: 'fourth'
		}
		expect(objectSort(obj, ['c', 'a'])).toEqual({
			c: 'zero',
			a: 'second',
			b: 'first',
			d: 'fourth'
		})
	})
	it('should sort by the specified key', () => {
		const obj = {
			b: 'first',
			a: 'second',
			c: 'zero',
			d: 'fourth'
		}
		// @ts-expect-error
		expect(objectSort(obj, ['c', 'a', 'e'])).toEqual({
			c: 'zero',
			a: 'second',
			b: 'first',
			d: 'fourth'
		})
	})
})

describe('Object Clone Tests', () => {
	it('should clone the object', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		const clone = objectClone(obj)
		expect(clone).toEqual(obj)
		clone.pouet = 'third'
		expect(clone).not.toEqual(obj)
	})

	it('should deeply clone the object', () => {
		const obj = {
			pouet: {is: 'first'},
			toto: 'second'
		}
		const clone = objectClone(obj)
		expect(clone).toEqual(obj)
		clone.toto = 'third'
		expect(clone).not.toEqual(obj)
	})

	it('should clone an Array', () => {
		const obj = ['one', 'two']
		const clone = objectClone(obj)
		expect(clone).toEqual(obj)
		clone[0] = 'three'
		expect(clone).not.toEqual(obj)
	})

	it('should deeply clone an Array', () => {
		const obj = ['one', 'two', ['three']]
		const clone = objectClone(obj)
		expect(clone).toEqual(obj)
		;(clone[2][0] as string) = 'zero'
		expect(clone).not.toEqual(obj)
	})


	it('should clone with Object.freeze', () => {
		const obj = Object.freeze({
			pouet: 'first',
			toto: 'second'
		})
		const clone = objectClone<Record<string, string>>(obj)
		expect(clone).toEqual(obj)
		clone.pouet = 'third'
		expect(clone).not.toEqual(obj)
	})
})

describe('Object Set Tests', () => {
	it('set the value of an empty object', () => {
		const obj = {}
		objectSet(obj, ['test'], true)
		expect(obj).toEqual({test: true})
	})

	it('set the deep value of an empty object', () => {
		const obj = {}
		objectSet(obj, ['test', 'pouet'], true)
		expect(obj).toEqual({test: {'pouet': true}})
	})

	it('set the deep first array value of an empty object', () => {
		const obj = {}
		objectSet(obj, ['test', 0], true)
		expect(obj).toEqual({test: [true]})
	})

	it('set the deep any array value of an empty object', () => {
		const obj = {}
		objectSet(obj, ['test', 2], true)
		expect(obj).toEqual({test: [undefined, undefined, true]})
	})

	it('delete the deep value of an object', () => {
		const obj = {test: {pouet: true}}
		objectSet(obj, ['test', 'pouet'], undefined)
		expect(obj).toEqual({test: {}})
	})
})

describe('Object Equal Test', () => {
	it('should be equal', () => {
		expect(objectEqual({pouet: true}, {pouet: true})).toBe(true)
	})
	it('should not be equal', () => {
		expect(objectEqual({pouet: true}, {pouet: false})).toBe(false)
	})
	it('should be deeply equal', () => {
		expect(objectEqual({pouet: {is: true}}, {pouet: {is: true}})).toBe(true)
	})
	it('should not be equal if lengths are differents', () => {
		expect(objectEqual({pouet: true, added: true }, {pouet: true})).toBe(false)
		expect(objectEqual({pouet: true }, {pouet: true, added: true})).toBe(false)
	})
	it('should not be equal if lengths are equal but content different', () => {
		expect(objectEqual({pouet: true, added: true }, {pouet: true, removed: true})).toBe(false)
	})
	it('should be equal object contains null', () => {
		expect(objectEqual({pouet: null, added: true }, {pouet: true, added: true})).toBe(false)
		expect(objectEqual({pouet: null, added: true }, {pouet: null, added: true})).toBe(true)
	})
	it('should be equal object contains undefined', () => {
		expect(objectEqual({pouet: undefined, added: true }, {pouet: true, added: true})).toBe(false)
		expect(objectEqual({pouet: undefined, added: true }, {pouet: undefined, added: true})).toBe(true)
	})
	it('should not be deeply equal', () => {
		expect(objectEqual({pouet: {is: true}}, {pouet: {is: false}})).toBe(false)
	})
	it('should not be differently equal', () => {
		expect(objectEqual({pouet: true}, {})).toBe(false)
	})
	it('should handle every types', () => {
		expect(objectEqual({
			a: [10, {b: 'c'}], d: '1', e: 2, f: true, g: null, h: undefined
		}, {
			a: [10, {b: 'c'}], d: '1', e: 2, f: true, g: null, h: undefined
		})).toBe(true)
	})
	it('should handle arrays with empty elements', () => {
		expect(objectEqual([,true], [,true])).toBe(true)
	})
})

describe('Object Clean Tests', () => {
	it('should clean undefined by default', () => {
		const obj = {a: '', b: null, c: undefined}
		objectClean(obj)
		expect(obj).toEqual({a: '', b: null})
	})
	it('should not clean when options.cleanUndefined is false', () => {
		const obj2 = {a: '', b: null, c: undefined}
		objectClean(obj2, {cleanUndefined: false})
		expect(obj2).toEqual({a: '', b: null, c: undefined})
	})
	it('should clean null when set', () => {
		const obj = {a: '', b: null, c: undefined}
		objectClean(obj, {cleanNull: true})
		expect(obj).toEqual({a: ''})
	})
	it('should clean deep by default', () => {
		const obj = {a: '', b: null, c: undefined, d: {da: '', db: null, dc: undefined}}
		objectClean(obj)
		expect(obj).toEqual({a: '', b: null, d: {da: '', db: null}})
	})
	it('should clean deep when set', () => {
		const obj = {a: '', b: null, c: undefined, d: {da: '', db: null, dc: undefined}}
		objectClean(obj, {deep: true})
		expect(obj).toEqual({a: '', b: null, d: {da: '', db: null}})
	})
})

describe('Object Omit Tests', () => {
	it('should omit certain elements', () => {
		const obj = {a: 'a', b: 'c', c: 'b'}
		expect(objectOmit(obj, 'b')).toEqual({a: 'a', c: 'b'})
	})
	it('should not care when key to omit is not present', () => {
		const obj = {a: 'a', b: 'c', c: 'b'}
		expect(objectOmit(obj, 'b', 'd')).toEqual({a: 'a', c: 'b'})
	})
	it('should work with Object.freeze', () => {
		const obj = {a: 'a', b: 'c', c: 'b'}
		expect(objectOmit(Object.freeze(obj), 'b', 'd')).toEqual({a: 'a', c: 'b'})
	})
	it('should work with an array', () => {
		const obj = [1, 2, 3, 4]
		expect(objectOmit(obj, 1, 3)).toEqual([1,undefined,3,undefined])
	})
})

describe('Is Object Tests', () => {
	it('null is not an "object"', () => {
		expect(isObject(null)).toBe(false)
	})
	it('boolean is not an "object"', () => {
		expect(isObject(true)).toBe(false)
	})
	it('undefined is not an "object"', () => {
		expect(isObject(undefined)).toBe(false)
	})
	it('string is not an "object"', () => {
		expect(isObject("null")).toBe(false)
	})
	it('number is not an "object"', () => {
		expect(isObject(0)).toBe(false)
	})
	it('object is an "object"', () => {
		expect(isObject({})).toBe(true)
	})
	it('array is an object', () => expect(isObject([])).toBe(true))
})


describe('object remap tests', () => {
	it('should works on objects', () => {
		expect(objectRemap({a: "pouet"}, (value, key) => {
			return {key: key + 'a', value}
		})).toEqual({aa: "pouet"})
	})
	it('should works on arrays', () => {
		const pouet: [string] = ['pokemon']
		expect(objectRemap(pouet, (value, key: number) => {
			return {key: key + 2, value}
		})).toEqual({2: "pokemon"})
	})
	it('should replace value', () => {
		expect(objectRemap({a: 'a', b: 'b'}, (value) => {
			return {key: 'b', value}
		})).toEqual({b: 'b'})
	})
	it('should throw an error in strict mode', () => {
		expect(() => {
			objectRemap({a: 'a', b: 'b'}, (value) => {
				return {key: 'b', value}
			}, {strict: true})
		}).toThrow()
	})
})
