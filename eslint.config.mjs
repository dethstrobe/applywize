import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import playwrightPlugin from "eslint-plugin-playwright"
import importPlugin from "eslint-plugin-import"
import eslintConfigPrettier from "eslint-config-prettier/flat"

export default [
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        // node globals
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      playwright: playwrightPlugin,
      import: importPlugin,
    },

    settings: {
      react: { version: "detect" },
    },

    rules: {
      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // TypeScript
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // Import
      "import/no-unresolved": "off",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Test files override
  {
    files: ["tests/**/*.ts", "tests/**/*.spec.ts", "**/*.spec.ts"],
    plugins: {
      playwright: playwrightPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "generated/**",
      ".generated/**",
      ".vite/**",
      ".vscode/**",
      ".wrangler/**",
      "playwright-report/**",
      "test-results/**",
      "*.config.{js,ts,mjs}",
      "doc/.docusaurus/**",
    ],
  },
  eslintConfigPrettier,
]
