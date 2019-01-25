const path = require('path');
const createConfig = require('./webpack.config');

module.exports = createConfig({
    entry: {
        circularDependencyNoWarn1:  "./test/circular-dependency-error-off-config.1.ts",
        circularDependencyNoWarn2:  "./test/circular-dependency-error-off-config.2.ts",
        circularDependency1:        "./test/circular-dependency.1.ts",
        circularDependency2:        "./test/circular-dependency.2.ts",
        circularDependency3:        "./test/circular-dependency.3.ts",
        circularDependency4:        "./test/circular-dependency.4.ts",
        circularDependency5:        "./test/circular-dependency.5.ts",
        circularDependency6:        "./test/circular-dependency.6.ts",
        circularDependency7:        "./test/circular-dependency.7.ts",
        deepLevel:                  "./test/deep-level.ts",
        injectedImplementation:     "./test/injected-implementation.ts",
        lazyMulti1:                 "./test/lazy-multi.1.ts",
        lazyMulti2:                 "./test/lazy-multi.2.ts",
        lazy:                       "./test/lazy.ts",
        multi:                      "./test/multi.ts",
        regular:                    "./test/regular.ts",
        singleton:                  "./test/singleton.ts",
        singletonDefault:           "./test/singleton-default-config.ts",
        transient:                  "./test/transient.ts",
        typeHierarchy1:             "./test/type-hierarchy.1.ts",
        typeHierarchy2:             "./test/type-hierarchy.2.ts",
    },
    output: {
        filename: "./[name].js",
        path: path.resolve(__dirname, "./build-test")
    }
});