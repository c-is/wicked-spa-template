module.exports = {
  extends: [
    // Use the Standard config as the base
    // https://github.com/stylelint/stylelint-config-standard
    'stylelint-config-standard',
    // Enforce a standard order for CSS properties
    // https://github.com/stormwarning/stylelint-config-recess-order
    'stylelint-config-recess-order',

    // Override rules that would interfere with Prettier
    // https://github.com/shannonmoeller/stylelint-config-prettier
    // 'stylelint-config-prettier',
    // Override rules to allow linting of CSS modules
    // https://github.com/pascalduez/stylelint-config-css-modules
    // 'stylelint-config-css-modules',
  ],
  plugins: [
    'stylelint-selector-bem-pattern',
  ],
  // plugins: [
  //   // Bring in some extra rules for SCSS
  //   'stylelint-scss',
  // ],
  // Rule lists:
  // - https://stylelint.io/user-guide/rules/
  // - https://github.com/kristerkari/stylelint-scss#list-of-rules
  rules: {
    // Allow newlines inside class attribute values
    'string-no-newline': null,
    // Enforce camelCase for classes and ids, to work better
    // with CSS modules
    // 'selector-class-pattern': /^[a-z][a-zA-Z]*(-(enter|leave)(-(active|to))?)?$/,
    'selector-id-pattern': /^[a-z][a-zA-Z]*$/,
    // Limit the number of universal selectors in a selector,
    // to avoid very slow selectors
    'selector-max-universal': 1,
    // Disallow allow global element/type selectors in scoped modules
    // 'selector-max-type': [0, { ignore: ['child', 'descendant', 'compounded'] }],

    // BEM
    'plugin/selector-bem-pattern': {
      // componentSelectors: {
      //   initial: '^\\.{componentName}(?:--[a-z]+)?$',
      //   combined: '^\\.combined-{componentName}-[a-z]+$',
      // },
      componentName: '[a-z]+',
      preset: 'bem',
      componentSelectors: componentName => {
        const WORD = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'
        const element = '(?:__' + WORD + ')?'
        const modifier = '(?:--' + WORD + '){0,2}'
        const attribute = '(?:\\[.+\\])?'
        return new RegExp('^\\.' + componentName + element + modifier + attribute + '$')
      },
      ignoreSelectors: /^\\.is-.+$/,
      utilitySelectors: '^\\.u-[a-z]+(?:-[a-zA-Z0-9]+)*+$',
    },
    // ===
    // SCSS
    // ===
    // 'scss/dollar-variable-colon-space-after': 'always',
    // 'scss/dollar-variable-colon-space-before': 'never',
    // 'scss/dollar-variable-no-missing-interpolation': true,
    // 'scss/dollar-variable-pattern': /^[a-z-]+$/,
    // 'scss/double-slash-comment-whitespace-inside': 'always',
    // 'scss/operator-no-newline-before': true,
    // 'scss/operator-no-unspaced': true,
    // 'scss/selector-no-redundant-nesting-selector': true,
    // // Allow SCSS and CSS module keywords beginning with `@`
    // 'at-rule-no-unknown': null,
    // 'scss/at-rule-no-unknown': true,
  },
}
