/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    basePath: '/featherballs',
    async redirects() {
        if (process.env.NODE_ENV !== 'development') return [];

        return [
            {
                source: '/',
                destination: '/featherballs',
                permanent: false,
                basePath: false
            }
        ];
    }
}

export default nextConfig;
