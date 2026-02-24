const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '4mb',
        },
    },
};

export default nextConfig;
