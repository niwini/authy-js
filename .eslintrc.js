require("@rushstack/eslint-patch/modern-module-resolution");

const path = require("path");

const tsConfig = path.resolve(__dirname, "tsconfig.json");

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@niwini/eslint-config-typescript",
  ],
  parserOptions: {
    project: ["tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  settings: {
    "import/external-module-folders": [
      "@niwini",
      "node_modules",
      ".yarn",
    ],
    "import/resolver": {
      typescript: {
        project: tsConfig,
      },
    },
  },
};
