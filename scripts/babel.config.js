module.exports = {
  presets: [
    [
      // '@babel/preset-typescript',
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            'last 2 versions',
            'ie >= 11',
          ],
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
  ],
};
