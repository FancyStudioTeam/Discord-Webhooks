import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
	input: 'src/index.ts',
	output: {
		compact: true,
		esModule: true,
		file: 'dist/index.js',
		format: 'esm',
		sourcemap: true,
	},
	plugins: [
		typescript(),
		commonjs(),
		nodeResolve({
			preferBuiltins: true,
		}),
	],
});
