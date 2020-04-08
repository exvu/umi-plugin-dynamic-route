
export default {
    target: 'node',
    cjs: { type: 'babel', lazy: true },
    disableTypeCheck: true,
    extraBabelPlugins: [
        [
            '@babel/plugin-transform-runtime',
        ]
    ]
};