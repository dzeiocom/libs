/// <reference types="jest" />

import URLManager from '../src/URLManager'

describe('Query Test', () => {
	it('should parse basic query', () => {
		const url = '?test=true'
		expect(new URLManager(url).toString()).toBe(url)
	})
	it('should parse query without value', () => {
		const url = '?test='
		const url2 = '?test'
		expect(new URLManager(url).toString()).toBe(url)
		expect(new URLManager(url2).toString()).toBe(url)
	})
	it('should ignore query without value while one has a value', () => {
		const url = '?test&test=pouet'
		expect(new URLManager(url).toString()).toBe('?test=pouet')
	})
	it('should parse array query', () => {
		const url = '?test=true&test=false&test=pouet'
		expect(new URLManager(url).toString()).toBe(url)
	})
	it('should parse all at once', () => {
		const url = '?test1=true&test2=&test3=true&test3=false'
		expect(new URLManager(url).toString()).toBe(url)
	})
})

describe('Global Tests', () => {
	it('should parse a monstrous url', () => {
		const url = 'git+ssh://username:password@domain.com:65565/path?test=true&test=false#hash'
		expect(new URLManager(url).toString()).toBe(url)
	})
})
