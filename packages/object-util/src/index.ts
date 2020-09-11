import ObjectUtil from './ObjectUtil'

ObjectUtil.objectLoop(ObjectUtil, (fn, key) => {
	// @ts-expect-error
	window[key as any] = fn
})

// @ts-expect-error
window.ObjectUtil = ObjectUtil
