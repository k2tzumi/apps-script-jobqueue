import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import ts from 'typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'iife',
    name: 'AppsScriptJobqueue',
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: false,
      preferBuiltins: true
    }),
    commonjs(),
    typescript({
      typescript: ts,
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          declarationMap: false
        }
      },
      useTsconfigDeclarationDir: false
    })
  ],
  external: []
};
