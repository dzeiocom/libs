# URL Manager

A very easy to use sitemap generator

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

// you can also add optionnal elements
sitemap.addEntry('/path', {
	// each one are optionnal and they don't all need to be added
	changefreq: 'always', // webpage change freq
	lastmod: new Date('2021-01-20'), // webpage lastmod Date
	priority: 1 // crawler priority
})
```

- finally build it !

```typescript
// it will return a string containing the whole sitemap
// if you are letting the library manage the response Object it will return an empty string but the page will render ! 
const result = sitemap.build()
```
