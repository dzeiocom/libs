# URL Manager

A very easy to use sitemap generator

![npm](https://img.shields.io/npm/v/easy-sitemap?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/easy-sitemap?style=flat-square)
![npm](https://img.shields.io/npm/dw/easy-sitemap?style=flat-square)

## Usage

- Import easy-sitemap

```typescript
import Sitemap from 'easy-sitemap'
// or
const Sitemap = require('easy-sitemap').default
```

- Initialize it

```typescript
// Create a new instance
const sitemap = new Sitemap('https://www.example.com') // initialize using your website base

// if you want to let the library manage the response object the line is this
const sitemap = new Sitemap('https://www.example.com', {
	response: res
})

```

- add you're paths

```typescript
sitemap.addEntry('/path')

// you can also add optional elements
sitemap.addEntry('/path', {
	// each one are optional and they don't all need to be added
	changefreq: 'always', // webpage change freq
	lastmod: new Date('2021-01-20'), // webpage lastmod Date
	priority: 1, // crawler priority,
	images: [{
		location: '/path', // Location can be a path as well as a complete url
		// Optional parameters in Image object
		caption: 'Image Caption',
		geoLocation: 'Image Geolocation',
		title: 'Image Title',
		license: 'Image License URL',

	}]
})
```

- finally build it !

```typescript
// it will return a string containing the whole sitemap
// if you are letting the library manage the response Object it will return an empty string but the page will render ! 
const result = sitemap.build()
```
