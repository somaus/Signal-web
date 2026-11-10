const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  globalIgnores(["dist/**", ".expo/**", "node_modules/**"]),
  {
    rules: { "no-console": "error", "import/no-named-as-default-member": "off" },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: { "@typescript-eslint/no-explicit-any": "error" },
  },
]);
