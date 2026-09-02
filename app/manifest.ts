import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "roltrapstuk",
    short_name: "roltrapstuk",
    description: "Crowdsourced escalator and lift status for 's-Hertogenbosch station.",
    start_url: "/",
    display: "standalone",
    background_color: "#12161c",
    theme_color: "#12161c",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
