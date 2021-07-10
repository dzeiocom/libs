# Dzeio Config

thoses are base configuration files for multiple items

## ESLint

Depending on your configuration add a `.eslintrc.json` to your repository and add the following code (remove the comments if you keep it a a json file)

```json
{
	"extends": [
		// Note: add only one file as they calls each ones out
		
		// Base configuration for javascript
		"./node_modules/@dzeio/config/eslint/base",

		// React configuration
		"./node_modules/@dzeio/config/eslint/react",

		// Typescript configuration
		"./node_modules/@dzeio/config/eslint/typescript",

		// Typescript AND React configuration
		"./node_modules/@dzeio/config/eslint/react-typescript",
	]
}
```

## Typescript

```json
{
	// Note: Only include one file

	// Base Typescript configuration
	"extends": "@dzeio/config/tsconfig.base.json",

	// Base NextJS configuration
	"extends": "@dzeio/config/tsconfig.nextjs.json",
}
```

## Copy-paste

files under the folder `copy-paste` are configurations that can't be extended so you'll have to copy/paste them into your repository