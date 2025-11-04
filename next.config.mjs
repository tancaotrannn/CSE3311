/** @type {import('next').NextConfig} */
const repo = "CSE3311";

const nextConfig = {
  output: "export",
  assetPrefix: "/" + repo + "/",
  basePath: "/" + repo,
  trailingSlash: true,
  images: {
    loader: "akamai",
    path: "",
  },
};

export default nextConfig;
