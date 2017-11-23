module.exports = {
    entry: {
        background: "./ts/BackgroundMain.ts",
        content: "./ts/ContentMain.ts",
        options: "./ts/options/OptionsMain.ts"
    },
    output: {
        filename: "[name].bundle.js",
        path: __dirname + "/dist",
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    externals: {
        "jquery": "$"
    },
    watchOptions: {
        ignored: /node_modules/
    }
};