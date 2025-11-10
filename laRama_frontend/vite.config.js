/**
 * Vite Configuration - LaRama Frontend
 * Configures build tool settings for React application with Tailwind CSS
 * Handles development server, build optimization, and plugin integration
 */

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Plugin configuration for React and styling
  plugins: [
    react(), // Enables React support with JSX transformation
    tailwindcss() // Integrates Tailwind CSS processing
  ],
  
  // Development server configuration
  server: {
    port: 5173,
    open: false, // Don't auto-open browser
    host: true // Allow external connections
  },
  
  // Build configuration
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: false, // Disable source maps in production
    minify: 'terser', // Use terser for minification
    rollupOptions: {
      output: {
        // Chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  
  // Environment variable configuration
  define: {
    __DEV__: JSON.stringify(true)
  }
})
