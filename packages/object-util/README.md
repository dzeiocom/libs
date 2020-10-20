# URL Manager

simple to use yet powerful Urls parser and formatter

## Usage

- Import URLManager

```typescript
import ObjectUtil from '@dzeio/object-util'
// or
const ObjectUtil = require('@dzeio/object-util').default

// or you can import each funcitons individually
```

- or import it from the browser

```html
<script src="https://cdn.jsdelivr.net/npm/@dzeio/object-util@1/dist/browser.js"></script>
<!-- It will be available as the same variable -->
```

- Create a new instance

```typescript
// Create a new instance
const url = new URLManager() // you can have an URL, URLSearchParams Objects or a string as parameter
// or
const url = URLManager.fromLocation() // Browser only return a new instance from the current location
```

- explore !

```typescript

// Does the same as Array.map
objectMap(object, (value, key) => {value + "pouet"})

// does the same as Array.forEach with the addon of stopping if false is returned (like break)
// and return if loop was finished or not
objectLoop(object, (value, key) => {})

// return the values of an object as an array
objectToArray(object)

// return the keys of an object as an array
ObjectKeys(object)

// return the count of an object keys
objectSize(object)

// like Array.sort it sort and return an ordered object
objectSort(object, /*optionnal*/ (key1, key2) => key1 - key2)

// deeply clone an object
cloneObject(object)

// deeply set an object value while creating empty childs if necessary
//ex: this will return {path1, [{path3: 'value'}]} if object is an empty object
objectSet(object, ['path1', 0, 'path3'], 'value')

// deeply compare two objects
objectEqual(object, object2)
```
