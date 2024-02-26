import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";
import { VitePluginRadar } from "vite-plugin-radar";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      eslint({ cache: false }),
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),
      VitePluginRadar({
        // Google Analytics tag injection
        analytics: {
          id: "G-WK0NXL9P3R",
        },
        gtm: [
          {
            id: "GTM-NCVHZ37",
          },
        ],
      }),
    ],
    server: {
      host: true,
      port: parseInt(process.env.VITE_PORT || "3000"),
    },
    build: {
      outDir: "build",
    },
  });
};
