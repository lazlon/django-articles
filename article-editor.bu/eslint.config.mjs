import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import stylistic from "@stylistic/eslint-plugin"

export default tseslint.config({
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        stylistic.configs.customize({
            semi: false,
            indent: 4,
            quotes: "double",
            jsx: false,
        }),
    ],
    rules: {
        "@stylistic/max-len": ["error", { code: 100 }],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-namespace": "off",
        "@stylistic/no-floating-decimal": "off",
        "@stylistic/arrow-parens": ["error", "as-needed"],
        "@stylistic/indent-binary-ops": "off",
        "@stylistic/multiline-ternary": "off",
        "@stylistic/brace-style": ["error", "1tbs"],
    },
})
