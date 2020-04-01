module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:jest/recommended'
  ],
  plugins: [
    'prettier',
    'jest'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    'jest/globals': true
  },
  rules: {
    'prettier/prettier': 'error'
  },
};
