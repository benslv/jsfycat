module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "max-len": ["error", { ignoreComments: true }],
    "no-console": [allow],
  },
};
