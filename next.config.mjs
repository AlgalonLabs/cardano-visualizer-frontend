/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['tsx', 'ts'],

    reactStrictMode: true,

    // If you need to add any custom Webpack configurations, do it here
    webpack: (config) => {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        });
        return config;
    }
};


export default nextConfig;