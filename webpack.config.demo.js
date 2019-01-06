const path = require('path');
const createConfig = require('./webpack.config');

module.exports = createConfig({
    entry: "./demo/demo.ts",
    output: {
        filename: "./demo.js",
        path: path.resolve(__dirname, "./build-demo")
    }
});