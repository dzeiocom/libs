/// <reference types="jest" />

import { objectSize, objectToArray, objectMap, objectSort, cloneObject, objectEqual } from '../src/ObjectUtil'


describe('Basic tests', () => {
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

	it('should convert the object to an array', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		expect(objectToArray(obj)).toEqual(['first', 'second'])
	})

	it('should run through the object', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		expect(objectMap(obj, (value, index) => {
			return [index, value]
		})).toEqual([['pouet', 'first'],['toto','second']])
	})

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
});

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
	it('should not be deeply equal', () => {
		expect(objectEqual({pouet: {is: true}}, {pouet: {is: false}})).toBe(false)
	})
	it('should not be differently equal', () => {
		expect(objectEqual({pouet: true}, {})).toBe(false)
	})
})
