import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import ts from 'typescript';

const stubFunctions = `function jobEventHandler() {
}
/**
 * Register for asynchronous processing.
 * @param {JobFunction} callback call back funtion
 * @param {Parameter} parameter Specify parameters to be passed to the callback function
 */
function enqueueAsyncJob(callback, parameter) {
}
/**
 * Create a delayed job
 * @param {Date} scheduled_at Scheduled time
 * @return {DelayedJobBroker} - delayed job
 */
function createDelaydJob(scheduled_at) {
}
/**
 * Consume job
 * @param {TimeBasedEvent} event Time-based event
 * @param {GlobalThis} appGlobalThis globalThis
 */
function consumeJob(event, appGlobalThis) {
}`;

export default {
  input: 'src/index.ts',
  output: {
      file: 'dist/index.js',
      format: 'iife',
      name: 'JobBroker',
      sourcemap: true,
      banner: stubFunctions
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
