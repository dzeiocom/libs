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

describe('image:image tests', () => {
	it('should build corretcly with single image:image', () => {
		const sitemap = new Sitemap('https://www.example.com')
		sitemap.addEntry('/path', {
			images: [{
				location: '/test',
				geoLocation: 'Nantes',
				title: 'Title',
				caption: 'Image Caption',
				license: 'Example license url'
			}]
		})
		expect(sitemap.build()).toMatchSnapshot()
	})
	it('should skip image:image if no location is set', () => {
		const sitemap = new Sitemap('https://www.example.com')
		sitemap.addEntry('/path', {
			// @ts-expect-error
			images: [{
				geoLocation: 'Nantes',
			}]
		})
		expect(sitemap.build()).toMatchSnapshot()
	})
	it('should skip image:image if there is more than 1000 images', () => {
		const sitemap = new Sitemap('https://www.example.com')
		sitemap.addEntry('/path', {
			images: Array.from(new Array(1001)).map(() => ({
				location: '/test',
			}))
		})
		expect(sitemap.build()).toMatchSnapshot()
	})
	it('should build corretcly with multiple image:image', () => {
		const sitemap = new Sitemap('https://www.example.com')
		sitemap.addEntry('/path', {
			images: [{
				location: '/test',
				geoLocation: 'Nantes',
				title: 'Title',
				caption: 'Image Caption',
				license: 'Example license url'
			}, {
				location: '/test-2',
				geoLocation: 'Paris',
				title: 'Title2',
				caption: 'Image Caption2',
				license: 'Example license url'
			}]
		})
		expect(sitemap.build()).toMatchSnapshot()
	})
})
