# URL Manager

A simple to use yet complete Urls parser and serializer

## Usage

- Import URLManager

```typescript
import URLManager from '@dzeio/url-manager'
// or
const URLManager = require('@dzeio/url-manager').default
```

- or import it from the browser

```html
<script src="https://cdn.jsdelivr.net/npm/@dzeio/url-manager@1/dist/browser.js"></script>
<!-- It will be available as the same variable -->
```

- Create a new instance

```typescript
// Create a new instance
const url = new URLManager(/* Optionnal */ baseUrl) // you can have an URL, URLSearchParams Objects or a string as parameter
```

- manipulate the url

```typescript

// Get set delete query
url.query() // get an object containing everything
url.query("sort") // get
url.query("sort", 'value') // set
url.query("sort", null) // delete

// get set the path
url.path() // get
url.path('/path') // set

// get set the protocol
url.protocol() // get
url.protocol('https') // set

// get set the multiple protocols
url.potocols() // get
url.protocols(['git', 'ssh']) //set

// get set the domain
url.domain() // get
url.domain('dzeio.com') // set

// get set the username
url.username() // get
url.username('avior') // set

// get set the password
url.password() // get
url.password('notapassword') // set

// get set the port
url.port() // get
url.port(22) // set

// get set the hash
url.hash() // get
url.hash('i-am-a-hash') // set
```

- format it back to a string

```typescript
url.toString() // => the serialized URL

// NOTE: if the path contains elements like [param]
// you can replace them in the toString function like this
// /pouet/[param] => /pouet/test
url.toString({param: 'test'})
```
