# Listener

Export an Abstract class o quicly add an isomorphic listener to your own classes

## how to use it

### Javascript

```javascript
const Listener = require('@dzeio/listener')

class Test extends Listener {
	public pouet() {
		this.emit('eventName')
	}
}

exports.default = Test

// Another file

const Test = require('./Test')

const test = new Test()
test.on('eventName', () => {
	console.log('Event Ran')
})
test.pouet()
```

### TS

```typescript
import Listener from '@dzeio/listener'

export default class Test extends Listener<
	eventName: () => void
> {
	public pouet() {
		this.emit('eventName')
	}
}

// Another file

import Test from './Test'

const test = new Test()
test.on('eventName', () => {
	console.log('Event Ran')
})
test.pouet()
```
