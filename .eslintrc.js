module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Possible Errors
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unreachable': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error',

    // Best Practices
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'curly': 'error',
    'dot-notation': 'error',
    'eqeqeq': 'error',
    'no-alert': 'warn',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-lone-blocks': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal': 'error',
    'no-param-reassign': 'warn', // Less restrictive than error
    'no-redeclare': 'error',
    'no-return-assign': ['error', 'always'],
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used' }], // Warn instead of error
    'no-use-before-define': ['error', { functions: false, classes: true }], // Allow function hoisting
    'prefer-const': 'warn', // Encourage but not enforce const

    // Stylistic Choices
    'no-trailing-spaces': 'warn',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
  },
};
