# Object Util

Utility functions to manipulate an object

## Usage

- Import Object Util

```typescript
import { objectMap, ... } from '@dzeio/object-util'
// or
const {objectMap, ...} = require('@dzeio/object-util')
```

- or import it from the browser

```html
<script src="https://cdn.jsdelivr.net/npm/@dzeio/object-util@1/dist/browser.js"></script>
<!-- each functions will be available as window.{objectMap, ...} or {objectMap, ...}-->
```

- explore !

```typescript

// Does the same as Array.map
objectMap(object, (value, key) => value + "pouet")

// does the same as Array.forEach with the addition of stopping if false is returned (like break)
// and return if loop was stopped or not
objectLoop(object, (value, key) => {})

// return the values of an object as an array
objectValues(object)

// return the keys of an object as an array
ObjectKeys(object)

// return the count of an object keys
objectSize(object)

// like Array.sort it sort and return an ordered object
objectSort(object, /*optionnal*/ (key1, key2) => key1 - key2)

// You can also sort by keys
// items not set in the array won't have their order changed and will be after the sorted ones
objectSort(object, ['key2', 'key1']) // => {key2: value, key1: value, key3: value}

// deeply clone an object
cloneObject(object)

// deeply set an object value while creating empty childs if necessary
//ex: this will set {path1, [{path3: 'value'}]} if object is an empty object
objectSet(object, ['path1', 0, 'path3'], 'value')

// deeply compare two objects
objectEqual(object, object2)

// deeply clean an object from undefined, null variables
objectClean(object, /* optionnal, defaults */{cleanUndefined: true, cleanNull: false, deep: true})

// clone (not deeply) an object and remove the keys from the object, 'a' and 'b' for this one
objectOmit(object, 'a', 'b')

// check if a variable is an object
isObject(object)
```

_note: with the exception of isObject, every function will throw an error if the object is not an object_
