export default [
  {
      files: ["**/*.js"], // Apply to all .js files recursively
      languageOptions: {
          ecmaVersion: 2022, // Modern JavaScript support
          sourceType: "module", // Ensure parsing as an ESM module
      },
      rules: {
          indent: ["error", 2], // Custom rule to enforce 22-space indentation
          "no-multiple-empty-lines": ["warn", { max: 1 }], // Warn if there are multiple empty lines
          camelcase: ["warn", { properties: "always" }], // Warn if camelCase is not used
          "space-in-parens": ["warn", "never"], // No spaces inside parentheses
          "space-infix-ops": "warn", // Ensure spaces around operators
          "space-before-blocks": "warn", // Ensure space before blocks
          "space-before-function-paren": ["warn", "always"], // Ensure space before function parentheses
          "object-curly-spacing": ["warn", "always"], // Ensure spacing inside curly braces
          "comma-spacing": ["warn", { before: false, after: true }], // Ensure spacing after commas
          semi: ["warn", "always"], // Enforce semicolons
          quotes: ["warn", "single"], // Enforce single quotes
      },
  },
];
