import Logger, { logger as console } from '../src/Logger'

Logger.timestamp = true

/**
 * This test file is simple :D
 */

// Should remove the precedent line
console.clear()

// Start a timer
console.time()
console.timeLog(undefined, 'Started Timer')

// Test assert
console.log('Assert')
console.assert(true, 'i am true') // should print nothing
console.assert(false, 'i am false') // Should print 'i am false'

// all the different logs
console.debug('debug')
console.dir('dir')
console.dirxml('dirxml')
console.error('error')
console.info('info')
console.log('log')
console.trace('trace')
console.warn('warn')

// Timelog
console.timeLog(undefined, 'timeLog')

console.group('New group')
console.group('New group')
console.group('New group')
console.group('New group')
console.group('New group')
console.group('New group')
console.group('New group')
console.group('New group')
console.log('Log in a group')
console.groupEnd()
console.groupEnd()
console.groupEnd()
console.groupEnd()
console.groupEnd()
console.groupEnd()
console.groupEnd()
console.groupEnd()
console.groupEnd()

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a'])

// TimeEnd
console.timeEnd()
