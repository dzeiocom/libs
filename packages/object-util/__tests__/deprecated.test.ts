/// <reference types="jest" />

import { cloneObject, objectToArray } from "../src/ObjectUtil"

describe('Object To Array Tests', () => {
	it('Should Works', () => {
		const obj = {
			pouet: 'first',
			toto: 'second'
		}
		expect(objectToArray(obj)).toEqual(['first', 'second'])
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
