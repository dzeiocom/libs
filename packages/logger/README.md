# @dzeio/logger

A Better logger for your test

## Install

For the browser via `unpkg` use it from Unpkg or download the file locally

```html
<script src="https://unpkg.com/@dzeio/logger/dist/browser.js"></script>
<script>
// Two Elements are available
var logger = new Logger('prefix') // To initialize a new Logger
// or
initConsole() // this will repace the default console by the logger
</script>
```

Via Yarn/NPM

```bash
yarn add @dzeio/logger
# or
npm i @dzeio/logger
```

## Usage

As the Logger Implements the `console` the usage don't vary on their function BUT you have more control

ex:

```js
import Logger from '@dzeio/logger' // Import the class
const logger = new Logger('prefix') // initialize it
// or
import { logger } from '@dzeio/logger' // Import already initialized one

// You can block Logging for some time
Logger.isBlocked(true) // false to unblock
```
