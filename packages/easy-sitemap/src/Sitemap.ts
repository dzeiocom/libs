import { ServerResponse } from 'http'

export default class Sitemap {

	private static allowedChangefreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']

	private datas = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

	public constructor(
		private domain: string, private options?: {
			response?: ServerResponse
		}
	) {
		if (this.options?.response) {
			this.options.response.setHeader('Content-Type', 'text/xml')
			this.options.response.write(this.datas)
		}
	}

	public addEntry(path: string, options?: {
		changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
		lastmod?: Date
		priority?: 1 | 0.9 | 0.8 | 0.7 | 0.6 | 0.5 | 0.4 | 0.3 | 0.2 | 0.1 | 0
	}) {
		let entryString = '<url>'

		const url = `${this.domain}${path}`
			.replace(/&/g, '&amp;')
			.replace(/'/g, '&apos;')
			.replace(/"/g, '&quot;')
			.replace(/>/g, '&gt;')
			.replace(/</g, '&lt;')

		entryString += `<loc>${url}</loc>`
		if (options) {
			if (options.changefreq) {
				if (!Sitemap.allowedChangefreq.includes(options.changefreq)) {
					console.warn(`changefreq is not one of the allowed words (${options.changefreq})\nChangeFreq won't be added`)
				} else {
					entryString += `<changefreq>${options.changefreq}</changefreq>`
				}
			}
			if (options.lastmod) {
				entryString += `<lastmod>${options.lastmod.toISOString()}</lastmod>`
			}
			if (options.priority) {
				if (options.priority <= 1 && options.priority >= 0 && options.priority.toString().length <= 3) {
					entryString += `<priority>${options.priority}</priority>`
				} else {
					console.warn(`Priority is not between 0 and 1 and only containing one decimal (${options.priority})\nPriority won't be added`)
				}
			}
		}
		entryString += '</url>'
		if (this.options?.response) {
			this.options.response.write(entryString)
		} else {
			this.datas += entryString
		}
	}

	public build(): string {
		if (this.options?.response) {
			this.options.response.write('</urlset>')
			this.options.response.end()
			return ''
		}
		return this.datas + '</urlset>'
	}
}
