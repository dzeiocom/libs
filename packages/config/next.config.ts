import { NextConfig, defaultConfig } from 'next/dist/server/config-shared'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'
// @ts-expect-error next-pre-css has no typing available
import preCSS from 'next-pre-css'

/**
 * Return a default NextJS hardened configuration with experimental features enabled and headers preset
 */
export const config = (additionnalHost: string): typeof defaultConfig & NextConfig => ({
	// Experimentals
	experimental: {
		plugins: true,
		profiling: process.env.NODE_ENV === 'developpment',
		isrFlushToDisk: true,

		// Bugged
		// https://github.com/vercel/next.js/issues/18913
		// reactRoot: true,
		workerThreads: true,

		pageEnv: true,
		optimizeImages: true,
		optimizeCss: true,

		scrollRestoration: true,

		stats: process.env.NODE_ENV === 'developpment',
		externalDir: true,
		conformance: true,
		disableOptimizedLoading: false,
		gzipSize: process.env.NODE_ENV === 'developpment',
		craCompat: false,



	},

	excludeDefaultMomentLocales: true,
	trailingSlash: false,
	cleanDistDir: true,
	generateEtags: true,
	compress: false,
	// Non experimental config
	// target: 'serverless',
	poweredByHeader: false,
	reactStrictMode: true,

	// Futures
	future: {
		strictPostcssConfiguration: true,
	},

	// Headers and rewrites
	async headers() {
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
				`script-src 'self' 'unsafe-inline' 'unsafe-eval' ${additionnalHost}; ` +
				"style-src 'self' 'unsafe-inline'; " +
				"img-src data: 'self'; " +
				"font-src 'self'; " +
				`connect-src 'self' ${additionnalHost}; ` +
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
			value: 'strict-origin-when-cross-origin'
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
