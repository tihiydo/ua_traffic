import createIntl from 'next-intl/plugin'
const withNextIntl = createIntl('./src/i18n/getRequestConfig.ts');
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: false,
    // images: {
    //     remotePatterns: [
    //         {
    //             protocol: 'https',
    //             hostname: 'api.telegram.org'
    //         },
    //         {
    //             protocol: 'https',
    //             hostname: '*.public.blob.vercel-storage.com'
    //         },
    //         // For testing
    //         {
    //             protocol: 'https',
    //             hostname: 'images.unsplash.com'
    //         }
    //     ]
    // },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default withNextIntl(config);
