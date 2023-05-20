import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from "node:path";

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, "../..");

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  resolve: {
    alias: {
      "@/": join(PACKAGE_ROOT, "src") + "/",
    },
  },
  plugins: [react()],
});
