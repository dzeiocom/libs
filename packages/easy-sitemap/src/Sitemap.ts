import { ServerResponse } from 'http'

export default class Sitemap {

	private static allowedChangefreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']

	private datas = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'

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

	/**
	 * Add a new Entry into the Sitemap
	 * @param path the url path
	 * @param options aditional datas you want in the sitemap for the `path`
	 */
	public addEntry(path: string, options?: {
		changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
		lastmod?: Date
		priority?: 1 | 0.9 | 0.8 | 0.7 | 0.6 | 0.5 | 0.4 | 0.3 | 0.2 | 0.1 | 0
		images?: Array<{
			location: string
			caption?: string
			geoLocation?: string
			title?: string
			license?: string
		}>
	}) {
		let entryString = '<url>'

		const url = this.fixText(`${this.domain}${path}`)

		entryString += `<loc>${url}</loc>`
		if (options) {
			if (options.changefreq) {
				if (!Sitemap.allowedChangefreq.includes(options.changefreq)) {
					console.warn(`changefreq is not valid (${options.changefreq})`)
				} else {
					entryString += `<changefreq>${options.changefreq}</changefreq>`
				}
			}
			if (options.lastmod) {
				entryString += `<lastmod>${this.fixText(options.lastmod.toISOString())}</lastmod>`
			}
			if (options.priority) {
				if (options.priority <= 1 && options.priority >= 0 && options.priority.toString().length <= 3) {
					entryString += `<priority>${options.priority}</priority>`
				} else {
					console.warn(`Priority is not valid (${options.priority})`)
				}
			}
			if (options.images) {
				if (options.images.length > 1000) {
					console.warn('image cant have more than 1000 images, skipping')
				} else {
					for (const image of options.images) {
						if (!image.location) {
							console.warn('Images need a Location')
							continue
						}
						entryString += '<image:image>'
						entryString += `<image:loc>${this.fixText(image.location.startsWith('/') ? `${this.domain}${image.location}` : image.location)}</image:loc>`
						entryString += this.optionalEntry('image:caption', image.caption)
						entryString += this.optionalEntry('image:geo_location', image.geoLocation)
						entryString += this.optionalEntry('image:title', image.title)
						entryString += this.optionalEntry('image:license', image.license)
						entryString += '</image:image>'
					}
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

	/**
	 * Finish the Sitemap
	 */
	public build(): string {
		if (this.options?.response) {
			this.options.response.write('</urlset>')
			this.options.response.end()
			return ''
		}
		return this.datas + '</urlset>'
	}

	private optionalEntry(tag: string, entry?: string) {
		return entry ? `<${tag}>${this.fixText(entry)}</${tag}>` : ''
	}

	private fixText(txt: string): string {
		return txt.replace(/&/g, '&amp;')
			.replace(/'/g, '&apos;')
			.replace(/"/g, '&quot;')
			.replace(/>/g, '&gt;')
			.replace(/</g, '&lt;')
	}
}
