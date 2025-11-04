import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";

import nextVitals from "eslint-config-next/core-web-vitals";
import next from "next";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-front": "off",
    },
  },
  globalIgnores([".next/**", , "out/**", "build/**", "next-env.d.ts"]),
]);

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
    ...nextVitals,
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-front": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  pluginReact.configs.flat.recommended,
]);
