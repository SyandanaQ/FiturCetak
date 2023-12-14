/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '/andromeda' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '/andromeda' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '/andromeda/upload.php' : '/api/upload'
    },
    rewrites: async () => {
        return [
            { source: '/api/send', destination: 'http://localhost:8000' }
        ];
    },
};

module.exports = nextConfig;
