/// <reference types="jest" />

import { objectSize, objectToArray, objectMap, objectSort, cloneObject, objectEqual, objectKeys, objectSet, objectLoop } from '../src/ObjectUtil'

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
})

describe('Object To Array Tests', () => {
	it('Should Works', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		expect(objectToArray(obj)).toEqual(['first', 'second'])
	})
})

describe('Object Keys Tests', () => {
	it('Should Works', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		expect(objectKeys(obj)).toEqual(['pouet', 'toto'])
	})
})

describe('Object Size Tests', () => {
	it('shoud return length of the object', () => {
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
})

describe('Object Clone Tests', () => {
	it('should clone the object', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		const clone = cloneObject(obj)
		expect(clone).toEqual(obj)
		clone.pouet = 'third'
		expect(clone).not.toEqual(obj)
	})

	it('should deeply clone the object', () => {
		const obj = {
			pouet: {is: 'first'},
			toto: 'second'
		}
		const clone = cloneObject(obj)
		expect(clone).toEqual(obj)
		clone.toto = 'third'
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
})
