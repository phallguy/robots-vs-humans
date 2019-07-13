module.exports = {
  extends: ["airbnb", "prettier"],
  plugins: ["react", "jsx-a11y", "jest"],

  env: {
    browser: true,
    es6: true,
    "jest/globals": true,
  },

  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },

  globals: {},

  rules: {
    quotes: [2, "double", "avoid-escape"],
    semi: [2, "never"],
    "react/prop-types": "off",
    "react/sort-prop-types": ["error"],
    "react/sort-comp": "warn",
    "react/no-set-state": "warn",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-no-bind": "warn",
    "react/jsx-sort-props": [
      "error",
      {
        ignoreCase: true,
        callbacksLast: true,
        shorthandFirst: true,
        reservedFirst: true,
      },
    ],
    "react/jsx-sort-default-props": [
      "error",
      {
        ignoreCase: true,
      },
    ],
    "react/no-unescaped-entities": "off",
    "no-use-before-define": "off",
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": "off"
  },
}