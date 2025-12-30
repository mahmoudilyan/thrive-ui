import type { NextConfig } from 'next';
import { createMDX } from 'fumadocs-mdx/next';

const nextConfig: NextConfig = {
	turbopack: {
		rules: {
			'*.svg': {
				loaders: [
					{
						loader: '@svgr/webpack',
						options: {
							icon: true,
						},
					},
				],
				as: '*.js',
			},
		},
	},
	reactStrictMode: true,
	// Performance optimizations
	swcMinify: true,
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	experimental: {
		optimizePackageImports: [
			'@thrive/ui',
			'fumadocs-ui',
			'fumadocs-core',
			'fumadocs-mdx',
			'react-icons',
		],
		optimizeCss: true,
		// Enable faster refresh
		optimisticClientCache: true,
	},
	transpilePackages: ['@thrive/ui'],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
