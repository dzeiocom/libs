import { objectLoop } from '@dzeio/object-util'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'
import { defaultConfig, NextConfig } from 'next/dist/server/config-shared'
// @ts-expect-error next-pre-css has no typing available
import preCSS from 'next-pre-css'

interface Options {
	/**
	 * Hold the lit of additionnal hosts the frontend might connect to
	 */
	hosts?: Partial<Record<
	'style'| 'script' | 'prefetch' | 'img' | 'font',
	Array<string>
>>
}

/**
 * Return a default NextJS hardened configuration with experimental features enabled and headers preset
 */
export const config = (options?: Options): typeof defaultConfig & NextConfig => ({
	excludeDefaultMomentLocales: true,
	trailingSlash: false,
	cleanDistDir: true,
	generateEtags: true,
	compress: false,

	poweredByHeader: false,
	reactStrictMode: true,

	crossOrigin: 'anonymous',
	swcMinify: true,


	// Headers and rewrites
	async headers() {
		const hosts = options?.hosts ?? {}

		if (process.env.NODE_ENV !== 'production') {
			if (!hosts.script) {
				hosts.script = []
			}
			hosts.script.push('unsafe-eval')
		}

		let hostlist: Array<string> = []

		objectLoop(hosts, (it) => {
			hostlist.push(...it)
		})

		hostlist = hostlist.filter((it, index, arr) => arr.indexOf(it) === index)

		// CSS no CSP, x-xss-protection
		const CSP = {
			key: 'Content-Security-Policy',
			value:
				// default-src is set to self because prefetch-src is not working propelly see: https://bugs.chromium.org/p/chromium/issues/detail?id=801561
				"default-src 'self'; " +
				"frame-ancestors 'none'; " +
				"form-action 'self'; " +
				"manifest-src 'self'; " +
				"prefetch-src 'self'; " +
				`script-src 'self' 'unsafe-inline' ${hosts?.script?.join(' ') ?? ''}; ` +
				`style-src 'self' 'unsafe-inline' ${hosts?.style?.join(' ') ?? ''}; ` +
				`img-src data: 'self' ${hosts?.img?.join(' ') ?? ''}; ` +
				`font-src 'self' ${hosts?.font?.join(' ') ?? ''}; ` +
				`connect-src 'self' ${hostlist.filter((it) => !it.startsWith('unsafe')).join(' ')}; ` +
				"base-uri 'self';"
		}
		const XXssProtection = {
			key: 'X-XSS-Protection',
			value: '1; mode=block'
		}
		// JS no x-xss-protection

		const headers = [{
			key: 'X-Frame-Options',
			value: 'DENY'
		}, {
			key: 'X-Content-Type-Options',
			value: 'nosniff'
		}, {
			key: 'Referrer-Policy',
			value: 'no-referer'
		}, {
			key: 'Permissions-Policy',
			value: 'geolocation=(), microphone=(), interest-cohort=()'
		}, {
			key: 'Strict-Transport-Security',
			value: 'max-age=63072000; includeSubDomains; preload'
		}, {
			key: 'X-Download-Options',
			value: 'noopen'
		}, {
			key: 'Expect-CT',
			value: 'max-age=86400, enforce'
		}]
		const excludedExtensions = ['js', 'css', 'json', 'ico', 'png']
			.map((ext) => `(?!\\.${ext}$)`).join('|')
		return [{
			source: `/:path*((?!^\\/_next\\/image)|${excludedExtensions})`,
			headers: [...headers, XXssProtection, CSP]
		}, {
			source: '/',
			headers: [...headers, XXssProtection, CSP]
		}, {
			// No CSP, XXssProtection
			source: `/:path*(\\.${excludedExtensions}$)`,
			headers: headers
		}, {
			// No CSP, XXssProtection
			source: '/_next/image:path*',
			headers: headers
		}]
	},
})

export const plugins = [preCSS, {
	cssModules: true,
	cssLoaderOptions: {
		localIdentName: "[hash:base64:6]",
	},
	[PHASE_DEVELOPMENT_SERVER]: {
		cssLoaderOptions: {
			localIdentName: "[path][name]__[local]"
		}
	}
}]
