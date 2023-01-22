import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [eslint(), react(), viteTsconfigPaths(), svgrPlugin()],
    server: {
      host: true,
      port: parseInt(process.env.VITE_PORT || '3000'),
    },
    build: {
      outDir: 'build',
    },
  });
};
