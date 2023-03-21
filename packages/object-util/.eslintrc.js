module.exports = {
	extends: "../config/eslint/typescript.json",
	root: true,
	"parserOptions": {
		"project": `${dirname}/tsconfig.json`
	}
}
