module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      'no-console': ["error", {
        "allow": ["warn", "error"]
      }],
      'no-await-in-loop': 'error',
      'for-direction': 'error',
      'block-scoped-var': 'error',
      'class-methods-use-this': 'error',
      'default-case': 'error',
      'no-implicit-globals': 'error',
      'no-param-reassign': 'error',
      'no-return-assign': 'error',
      'no-new': 'error',
      'no-self-compare': 'error',
      'no-restricted-syntax': ['error', 'SequenceExpression'],
      'no-throw-literal': 'warn',
      'no-unused-expressions': 'error',
      'no-useless-concat': 'warn',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': 'error',
      'require-await': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'handle-callback-err': 'error',
      'eqeqeq': 'error'
    }
};