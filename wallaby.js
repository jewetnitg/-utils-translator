module.exports = function (w) {
    var tsconfig = require('./tsconfig.json');

    return {
        files: [
            'src/main/**/*.ts',
            'src/main/**/*.tsx',
            '!src/test/**/*.ts',
            '!src/test/**/*.tsx',
            'jest.config.json',
            'tsconfig.json'
        ],

        tests: [
            'src/test/**/*.spec.ts',
            'src/test/**/*.spec.tsx'
        ],

        env: {
            type  : 'node',
            runner: 'node'
        },

        testFramework: 'jest',

        setup: function (wallaby) {
            var jestConfig     = require('./jest.config.json');
            jestConfig.globals = { "__DEV__": true };
            wallaby.testFramework.configure(jestConfig);
        },

        compilers: {
            '**/*.ts' : w.compilers.typeScript(),
            '**/*.tsx' : w.compilers.typeScript()
        }
    };
};