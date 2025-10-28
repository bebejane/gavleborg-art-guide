import { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	sassOptions: {
		includePaths: ['./components', './app'],
		silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
		prependData: `
			@use "sass:math";
    	@import "./styles/mediaqueries";
  	`,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config) => {
		config.module.exprContextCritical = false;
		config.resolve.alias['datocms.config'] = path.join(__dirname, 'datocms.config.ts');
		return config;
	},
	turbopack: {
		resolveAlias: {
			'datocms.config': './datocms.config.ts',
		},
	},
	transpilePackages: ['@mantina/core', '@mantine/form'],

	async headers() {
		return [
			{
				source: '/api/web-previews',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{ key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
			{
				source: '/api/backup',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' }, // replace this your actual origin
					{ key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
		];
	},
};

export default nextConfig;
