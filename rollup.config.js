import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default [
  // ES
  {
    input: "src/index.ts",
    output: {
      file: "dist/es/index.js",
      format: "es",
    },
    plugins: [
      typescript(),
      commonjs(),
      // babel({
      //   extensions: [".ts"],
      // }),
    ],
  },

  // UMD
  {
    input: "src/index.ts",
    output: {
      file: "dist/js-confetti.min.js",
      format: "umd",
      name: "jsConfetti",
      indent: false,
    },
    plugins: [
      typescript(),
      commonjs(),
      // babel({
      //   extensions: [".ts"],
      //   exclude: "node_modules/**",
      // }),
      terser(),
    ],
  },

  // IIFE
  {
    input: "src/index.ts",
    output: {
      file: "dist/js-confetti.browser.js",
      format: "iife",
      name: "JSConfetti",
    },
    plugins: [
      typescript(),
      commonjs(),
      // babel({
      //   extensions: [".ts"],
      //   exclude: "node_modules/**",
      // }),
      terser(),
    ],
  },
];
