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
      // Possible errors
      'no-console': 'error',
      'no-debugger': 'error',
      'no-unreachable': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
  
      // Best practices
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'complexity': ['error', 10],
      'consistent-return': 'error',
      'curly': 'error',
      'default-case': 'error',
      'dot-notation': 'error',
      'eqeqeq': 'error',
      'for-direction': 'error',
      'func-names': 'off',
      'func-style': ['error', 'declaration'],
      'max-depth': ['error', 4],
      'max-params': ['error', 3],
      'max-statements': ['error', 20],
      'new-cap': 'error',
      'no-alert': 'error',
      'no-caller': 'error',
      'no-div-regex': 'error',
      'no-else-return': 'error',
      'no-empty': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-parens': 'error',
      'no-implied-eval': 'error',
      'no-invalid-regexp': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': 'error',
      'no-multi-spaces': 'error',
      'no-multi-str': 'error',
      'no-native-reassign': 'error',
      'no-negated-in-lhs': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-require': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-path-concat': 'error',
      'no-plusplus': 'error',
      'no-process-env': 'error',
      'no-process-exit': 'error',
      'no-proto': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-restricted-globals': 'error',
      'no-restricted-modules': 'error',
      'no-restricted-properties': 'error',
      'no-restricted-syntax': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-sync': 'error',
      'no-tabs': 'error',
      'no-template-curly-in-string': 'error',
      'no-ternary': 'off',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'off',
      'no-underscore-dangle': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-unused-expressions': 'error',
      'no-unused-labels': 'error',
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used' }],
      'no-use-before-define': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-warning-comments': 'error',
      'no-with': 'error',
    'prefer-const': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-reflect': 'off',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'radix': 'error',
    'require-atomic-updates': 'error',
    'require-await': 'error',
    'require-yield': 'error',
    'strict': ['error', 'never'],
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
    'unicode-bom': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error',
    'wrap-iife': ['error', 'any'],
    'wrap-regex': 'error',
    'yield-star-spacing': 'error',
  },
};
