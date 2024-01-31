/** @type {import('next').NextConfig} */

const debug = process.env.NODE_ENV !== "production";
const repository = "http://toothlessdev.github.io";

const nextConfig = {
    basePath: "",
    reactStrictMode: true,

    output: "export",
};

export default nextConfig;
