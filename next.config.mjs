import nextPWA from 'next-pwa';

const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

const nextConfig = {
    reactStrictMode: true,
    ...withPWA
};

export default nextConfig;
