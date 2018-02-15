const gulp = require("gulp");
const pump = require("pump");
const concatCss = require("gulp-concat-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rollup = require("rollup");
const rollupConfig = require("./rollup.config");

async function doRollup(options)
{
	const bundle = await rollup.rollup({
		input: options.input,
		plugins: options.plugins,
		external: options.external,
		context: options.context
	});

	await bundle.write(options.output);
}

gulp.task("background-scripts", async () => 
{
	await doRollup(rollupConfig.background);
});

gulp.task("content-scripts", async () => 
{
	await doRollup(rollupConfig.content);
});

gulp.task("options-scripts", async () => 
{
	await doRollup(rollupConfig.options);
});

gulp.task("options-styles", (callback) => 
{
	pump([
		gulp.src("./css/options.css"),
		concatCss("options.bundle.css"),
		postcss([
			autoprefixer()
		]),
		gulp.dest("./dist/options/css")
	], callback);
});

gulp.task("scripts", ["background-scripts", "content-scripts", "options-scripts"]);

gulp.task("styles", ["options-styles"]);

gulp.task("all", ["scripts", "styles"]);

gulp.task("watch", ["all"], () => 
{
	gulp.watch([
		"./ts/**/*",
	], ["scripts"]);

	gulp.watch([
		"./css/**/*"
	], ["styles"]);
});
