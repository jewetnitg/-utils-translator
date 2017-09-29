// Copyright 2004-present Facebook. All Rights Reserved.

const tsc = require('typescript');

module.exports = {
    process(src, path) {
        if (path.endsWith('.ts') || path.endsWith('.tsx')) {
            let transpiled = tsc.transpileModule(src, {
                fileName       : path,
                compilerOptions: {
                    sourceMap: true,
                    jsx      : tsc.JsxEmit.React,
                    module   : tsc.ModuleKind.CommonJS,
                }
            });

            return {
                code: transpiled.outputText,
                map : transpiled.sourceMapText
            };
        }
        return src;
    },
};