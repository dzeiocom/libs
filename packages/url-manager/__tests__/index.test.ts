/// <reference types="jest" />

import URLManager from '../src/URLManager'


describe('Basic tests', () => {
	it('should be able to create some basics urls', () => {
		expect(new URLManager().domain('domain.com').toString()).toBe('domain.com');
		expect(new URLManager().path('path').toString()).toBe('/path');
	});
	it('should compile a full url', () => {
		const url = new URLManager()
			.protocols(['git', 'ssh'])
			.username('username')
			.password('password')
			.domain('domain.com')
			.port(65565)
			.path('/path')
			.query('test', 'true')
			.hash('hash')
		expect(url.toString())
			.toBe('git+ssh://username:password@domain.com:65565/path?test=true#hash')
	})

	it('should be able to add and delete query', () => {
		const url = new URLManager()
		// Test base url
		expect(url.toString()).toBe('')
		url.query('test', 'true')

		// Test basic Query add
		expect(url.toString()).toBe('?test=true')
		url.query('test', ['a', 'b'])

		// Test Query Array
		expect(url.toString()).toBe('?test=a&test=b')

		// Test Query Array with Array Join
		expect(url.toString(undefined, {queryArrayJoin: ','})).toBe('?test=a,b')

		url.query('test', null)
		// Test Query Deletion
		expect(url.toString()).toBe('')
	})
});

describe('Protocol Tests', () => {
	it('should set the protocol', () => {
		const protocol = 'https'

		const url = new URLManager('domain.com').protocol(protocol)
		expect(url.toString()).toBe('https://domain.com')
	})

	it('should return the url protocol', () => {

		const url = new URLManager('https://domain.com')
		expect(url.protocol()).toBe('https')
	})

	it('should override the current protocol', () => {
		const url = new URLManager('ssh://domain.com').protocol('https')
		expect(url.toString()).toBe('https://domain.com')
	})
	it('should set multiple protocols', () => {
		const url = new URLManager('domain.com').protocols(['git', 'ssh'])
		expect(url.toString()).toBe('git+ssh://domain.com')
	})
	it('should override every protocols', () => {
		const url = new URLManager('https+sftp://domain.com').protocols(['git', 'ssh'])
		expect(url.toString()).toBe('git+ssh://domain.com')
	})
	it('should replace every protocols with only one', () => {
		const url = new URLManager('git+ssh://domain.com').protocol('https')
		expect(url.toString()).toBe('https://domain.com')
	})
})

describe('Special cases', () => {
	it('should generate a new url from URLSearchParams', () => {
		const search = new URLSearchParams('?test=true')
		expect(new URLManager(search).toString()).toBe('?test=true')
	})

	it('should generate a new url from URL', () => {
		const url = new URL('https://domain.com/test')
		expect(new URLManager(url).toString()).toBe('https://domain.com/test')
	})

	it('should format the template url', () => {
		const tmpl = '/test/[pouet]/home'
		expect(new URLManager(tmpl).toString({ pouet: 'true' })).toBe('/test/true/home')
	})
	it('should not format the template url if not in params', () => {
		const tmpl = '/test/[url-manager]/home'
		expect(new URLManager(tmpl).toString({ pouet: 'true' })).toBe('/test/[url-manager]/home')
	})
})
