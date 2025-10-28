import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js, React: pluginReact, "@next/next": pluginNext },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  pluginReact.configs.flat.recommended,
]);
