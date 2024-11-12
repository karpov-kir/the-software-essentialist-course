// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import typescriptEslint from "typescript-eslint";

/**
 * Cast types, this should get fixed with new releases.
 * Although types don't match, everything works well.
 */
/** @type {import('eslint').Linter.Config} */
const reactRecommendedConfig = reactPlugin.configs.flat.recommended;
/** @type {import('eslint').ESLint.Plugin} */
const reactHooksPluginCasted = reactHooksPlugin;
/** @type {import('eslint').Linter.RulesRecord} */
const reactHooksPluginRules = reactHooksPlugin.configs.recommended.rules;

export default typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  reactRecommendedConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
      "react-refresh": reactRefreshPlugin,
      "react-hooks": reactHooksPluginCasted,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react-refresh/only-export-components": "warn",
      "react/react-in-jsx-scope": "off",
      ...reactHooksPluginRules,
    },
  },
);
