import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/envios",
        destination: "/envios-y-entregas",
        permanent: true,
      },
      {
        source: "/devoluciones",
        destination: "/cambios-y-devoluciones",
        permanent: true,
      },
      {
        source: "/terminos",
        destination: "/terminos-y-condiciones",
        permanent: true,
      },
      {
        source: "/privacidad",
        destination: "/politicas-de-privacidad",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;