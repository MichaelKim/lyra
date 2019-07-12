module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    __static: true
  },
  rules: {
    'flowtype/generic-spacing': 0
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
