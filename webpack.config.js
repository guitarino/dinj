module.exports = function createConfig(
    config
) {
    return {
        entry: config.entry,
        mode: "development",
        target: "node",
        output: config.output,
        resolve: {
            extensions: ['.ts', '.js', '.json']
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(ts|m?js)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                    }
                }
            ]
        }
    };
}