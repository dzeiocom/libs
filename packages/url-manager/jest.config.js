module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.test.json'
		},
		"transform": {
			".(ts|tsx)": " ../../node_modules/ts-jest/preprocessor.js"
		},
		"testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
		"testResultsProcessor": "../../node_modules/ts-jest/coverageprocessor.js",
		"collectCoverageFrom": ["src/URLManager.ts"],
		"moduleFileExtensions": [
			"ts",
			"tsx",
			"js"
		],
	},
}
