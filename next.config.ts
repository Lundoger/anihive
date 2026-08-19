import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // Order matters — the first entry the browser accepts wins. With webp first
    // avif was never served, since every avif-capable browser also accepts webp.
    formats: ["image/avif", "image/webp"],
    // Only 75 (default) and 100 (Hero carousel) are used; every extra value is
    // another cache entry someone can make the optimizer produce.
    qualities: [75, 100],
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 31 days. The default is 4h, and the previous 60s meant returning visitors
    // re-downloaded every image and the server re-encoded it. Optimized images
    // cannot be invalidated, so renaming the file is the way to replace one.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/s/common/company_logos/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Files in `public` are served with `max-age=0`, and the optimized
        // response takes the larger of that and `minimumCacheTTL`. These are
        // fixed art assets, so they get the long one — replacing a picture
        // means giving it a new filename.
        source: "/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
