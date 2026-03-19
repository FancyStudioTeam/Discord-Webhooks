import { defineConfig } from 'oxlint';

export default defineConfig({
	ignorePatterns: ['**/dist'],
	options: {
		typeAware: true,
		typeCheck: true,
	},
	rules: {
		eqeqeq: 'error',
		'prefer-node-protocol': 'error',
		'prefer-nullish-coalescing': 'error',
		'sort-keys': 'warn',
	},
});
