const path = require('path');
const createConfig = require('./webpack.config');

module.exports = createConfig({
    entry: "./src/main.ts",
    output: {
        filename: "./main.js",
        path: path.resolve(__dirname, "./build")
    }
});