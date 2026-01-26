/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    basePath: '/fuzzballs',
    async redirects() {
        if (process.env.NODE_ENV !== 'development') return [];

        return [
            {
                source: '/',
                destination: '/fuzzballs',
                permanent: false,
                basePath: false
            }
        ];
    }
}

export default nextConfig;
