import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [react()],
})
