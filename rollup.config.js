const rollupTypescript = require("rollup-plugin-typescript");
const rollupNodeResolve = require("rollup-plugin-node-resolve");
const ts = require("typescript");

const externals = ["jquery", "blob-util"];
const globals = {
	jquery: "$",
	"blob-util": "blobUtil"
};

module.exports = {
	background: {
		input: "./ts/BackgroundMain.ts",
		plugins: [
			rollupTypescript({
				typescript: ts
			}),
			rollupNodeResolve({
				customResolveOptions: {
					moduleDirectory: "node_modules"
				}
			})
		],
		external: externals,
		output: {
			file: "./dist/background/js/background.bundle.js",
			format: "umd",
			name: "background",
			globals: globals,
			sourcemap: true
		},
		context: "window"
	},
	content: {
		input: "./ts/ContentMain.ts",
		plugins: [
			rollupTypescript({
				typescript: ts
			}),
			rollupNodeResolve({
				customResolveOptions: {
					moduleDirectory: "node_modules"
				}
			})
		],
		external: externals,
		output: {
			file: "./dist/content/js/content.bundle.js",
			format: "umd",
			name: "content",
			globals: globals,
			sourcemap: true
		},
		context: "window"
	},
	options: {
		input: "./ts/options/OptionsMain.ts",
		plugins: [
			rollupTypescript({
				typescript: ts
			}),
			rollupNodeResolve({
				customResolveOptions: {
					moduleDirectory: "node_modules"
				}
			})
		],
		external: externals,
		output: {
			file: "./dist/options/js/options.bundle.js",
			format: "umd",
			name: "options",
			globals: globals,
			sourcemap: true
		},
		context: "window"
	}
};
