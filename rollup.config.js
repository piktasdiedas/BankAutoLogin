import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins';

export default [{
  input: 'src/bg/background.js',
  output: {
    file: 'build/background.js',
    format: 'iife'
  },
  plugins: [
    builtins(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    babel({
      babelHelpers: 'external',
      exclude: 'node_modules/**',

      plugins: [
        "@babel/plugin-external-helpers"
      ]
    }),
    commonjs(),
  ],
}, {
  input: 'src/content_scripts/content.js',
  output: {
    file: 'build/content.js',
    format: 'iife'
  },
  plugins: [
    builtins(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    babel({
      babelHelpers: 'external',
      exclude: 'node_modules/**',

      plugins: [
        "@babel/plugin-external-helpers"
      ]
    }),
    commonjs(),
  ],
}]