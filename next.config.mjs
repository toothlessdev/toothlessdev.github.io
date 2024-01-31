/** @type {import('next').NextConfig} */

const debug = process.env.NODE_ENV !== "production";
const repository = "http://toothlessdev.github.io";

const nextConfig = {
    output: "export",
    basePath: "",

    images: {
        unoptimized: true,
    },

    reactStrictMode: true,
};

export default nextConfig;
