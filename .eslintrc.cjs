/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    'alloy',
    'alloy/vue',
  ],
  // extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': 'error',
    'vue/valid-template-root': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index', '401', '404'],
      },
    ],
    'no-undef': 'off',
  },
};
