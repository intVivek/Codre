/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL,
      },
      images: { domains: ["lh3.googleusercontent.com"], formats: ['image/avif', 'image/webp'], }
}

module.exports = nextConfig
