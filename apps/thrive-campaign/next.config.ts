import type { NextConfig } from 'next';
// import fs from 'fs';
// import path from 'path';

// Load environment variables from root directory
// const loadEnvFromRoot = () => {
// 	const rootDir = path.resolve(__dirname, '../../');
// 	const envFiles = ['.env.local', '.env.development', '.env.production', '.env'];

// 	envFiles.forEach(file => {
// 		const envPath = path.join(rootDir, file);
// 		if (fs.existsSync(envPath)) {
// 			require('dotenv').config({ path: envPath });
// 		}
// 	});
// };

// // Load environment variables
// loadEnvFromRoot();

// Read basePath from environment variable, with a default for local development
//const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '/Dashboard3';

const nextConfig: NextConfig = {
	//basePath: appBasePath,
	// Enable transpilation of workspace packages for development hot reload
	transpilePackages: ['@thrive/ui'],
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		ignoreBuildErrors: true,
	},
	experimental: {
		// Enable faster development rebuilds for workspace packages
		optimizePackageImports: [
			'@thrive/ui',
			'@tanstack/react-table',
			'@fullcalendar/react',
			'react-icons',
			'recharts',
		],
	},
	// Turbopack configuration (replaces experimental.turbo)
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
	// Performance optimizations
	poweredByHeader: false,
	compress: true,
	// Image optimization
	images: {
		formats: ['image/webp', 'image/avif'],
		minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	// Webpack configuration (used when not using Turbopack)
	webpack: (config: any, { isServer }) => {
		// Watch for changes in the UI package (for webpack mode)
		if (!isServer) {
			config.watchOptions = {
				...config.watchOptions,
				ignored: ['**/node_modules', '!**/node_modules/@thrive/ui/**'],
			};
		}

		// Bundle analyzer in development (only when needed)
		if (process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'development') {
			const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
			config.plugins.push(
				new BundleAnalyzerPlugin({
					analyzerMode: 'server',
					openAnalyzer: false,
				})
			);
		}

		return config;
	},
	// publicRuntimeConfig: {
	// 	basePath: appBasePath, // Also expose it here for existing getConfig() users
	// },
	// async headers() {
	// 	return [
	// 		{
	// 			source: '/:path*',
	// 			headers: [
	// 				{
	// 					key: 'Strict-Transport-Security',
	// 					value: 'max-age=31536000; includeSubDomains',
	// 				},
	// 				{
	// 					key: 'X-Content-Type-Options',
	// 					value: 'nosniff',
	// 				},
	// 				{
	// 					key: 'X-Frame-Options',
	// 					value: 'DENY',
	// 				},
	// 				{
	// 					key: 'X-XSS-Protection',
	// 					value: '1; mode=block',
	// 				},
	// 			],
	// 		},
	// 	];
	// },
	// Add HTTPS redirection
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: '/:path*',
	// 			has: [
	// 				{
	// 					type: 'host',
	// 					value: 'uix.vbout.com:3010',
	// 				},
	// 			],
	// 			destination: 'https://uix.vbout.com:3010/:path*',
	// 		},
	// 	];
	// },
};

export default nextConfig;
