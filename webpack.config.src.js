const path = require('path');
const createConfig = require('./webpack.config');

module.exports = createConfig({
    entry: "./src/index.ts",
    output: {
        filename: "./index.js",
        path: path.resolve(__dirname, "./build")
    }
});