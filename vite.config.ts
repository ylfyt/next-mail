import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  console.log(`Building the app with ${mode} mode...`);
  return {
    plugins: [react()],
    base: mode === 'production:android' ? '/' : '/next-mail'
  }
})
