const rollupTypescript = require("rollup-plugin-typescript");
const rollupNodeResolve = require("rollup-plugin-node-resolve");
const rollupCommonJs = require("rollup-plugin-commonjs");
const ts = require("typescript");

const myExternals = ["jquery", "blob-util"];

const myGlobals = {
	jquery: "$",
	"blob-util": "blobUtil"
};

const myPlugins = [
	rollupTypescript({
		typescript: ts
	}),
	rollupNodeResolve({
		customResolveOptions: {
			moduleDirectory: "node_modules"
		}
	}),
	rollupCommonJs({
		include: ["node_modules/strongly-typed-events/**"]
	})
];

module.exports = {
	background: {
		input: "./ts/BackgroundMain.ts",
		plugins: myPlugins,
		external: myExternals,
		output: {
			file: "./dist/background/js/background.bundle.js",
			format: "umd",
			name: "background",
			globals: myGlobals,
			sourcemap: true
		},
		context: "window"
	},
	content: {
		input: "./ts/ContentMain.ts",
		plugins: myPlugins,
		external: myExternals,
		output: {
			file: "./dist/content/js/content.bundle.js",
			format: "umd",
			name: "content",
			globals: myGlobals,
			sourcemap: true
		},
		context: "window"
	},
	options: {
		input: "./ts/options/OptionsMain.ts",
		plugins: myPlugins,
		external: myExternals,
		output: {
			file: "./dist/options/js/options.bundle.js",
			format: "umd",
			name: "options",
			globals: myGlobals,
			sourcemap: true
		},
		context: "window"
	}
};
