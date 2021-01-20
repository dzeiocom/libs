/// <reference types="jest" />

import Sitemap from '../src/Sitemap'

describe('Basic Sitemap Tests', () => {
	it('should return an empty sitemap', () => {
		const sitemap = new Sitemap('https://www.example.com')
		expect(sitemap.build()).toMatchSnapshot()
	})
	it('should return a basic sitemap', () => {
		const sitemap = new Sitemap('https://www.example.com')
		sitemap.addEntry('/path')
		sitemap.addEntry('/')
		expect(sitemap.build()).toMatchSnapshot()
	})
	it('should return a sitemap', () => {
		const sitemap = new Sitemap('https://www.example.com')
		sitemap.addEntry('/path', {
			changefreq: 'always',
			lastmod: new Date('2021-01-20'),
			priority: 1
		})
		sitemap.addEntry('/')
		expect(sitemap.build()).toMatchSnapshot()
	})
	it('should not add priority when it is incorrect', () => {
		const sitemap = new Sitemap('https://www.example.com')
		sitemap.addEntry('/path', {
			// @ts-expect-error
			priority: 255
		})
		expect(sitemap.build()).toMatchSnapshot()
	})
	it('should not add changefreq if value is incorrect', () => {
		const sitemap = new Sitemap('https://www.example.com')
		sitemap.addEntry('/path', {
			// @ts-expect-error
			changefreq: 'pouet'
		})
		expect(sitemap.build()).toMatchSnapshot()
	})

})
