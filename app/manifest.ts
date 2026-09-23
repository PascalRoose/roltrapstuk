import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "roltrapstuk",
    short_name: "roltrapstuk",
    description: "Actuele status van de roltrappen en liften op station 's-Hertogenbosch.",
    lang: "nl",
    start_url: "/",
    display: "standalone",
    background_color: "#12161c",
    theme_color: "#12161c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
