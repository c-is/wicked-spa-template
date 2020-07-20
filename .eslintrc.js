module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
  },
  rules: {
    // You can do your customizations here...
    // For example, if you don't want to use the prop-types package,
    // you can turn off that recommended rule with: 'react/prop-types': ['off']
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: false }],
    'import/no-extraneous-dependencies': 'off',
    'no-confusing-arrow': 0, // it's got an eslint bug for now
  },
  overrides: [
    {
      extends: ['airbnb-base', 'eslint:recommended'],
      // env: {
      //   browser: true,
      //   commonjs: true,
      //   es6: true,
      // },
      files: ['src/**/*'],
      settings: {
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
          },
        ],
        'import/resolver': {
          alias: {
            map: require('./scripts/aliases.config.js').eslint,
            extensions: ['.js', '.json'],
          },
          node: {
            paths: ['src/**/*'],
            extensions: ['.js',],
          },
        },
      },
      rules: {
        semi: [2, 'never'],
        'arrow-parens': [2, 'as-needed', { requireForBlockBody: false }],
        'import/no-extraneous-dependencies': 'off',
        'no-confusing-arrow': 0, // it's got an eslint bug for now
        'import/extensions': 0, // THIS IS A TEMPORARY SOLUTION
        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
        'global-require': 'off',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 0,
        'react/state-in-constructor': 'off',
        '@typescript-eslint/no-var-requires': 0,
        'no-underscore-dangle': ['error', { allow: ['_id'] }],
      },
    },
  ],
};
