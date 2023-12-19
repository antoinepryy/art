import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
    root: './app', // Set the root to your app directory

    // Configure how modules are resolved
    resolve: {
        alias: {
            // Set aliases for directories, can make imports cleaner
            '@': path.resolve(__dirname, './app')
        }
    },

    // Configure the build output
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, './app/index.html'),
                mouse: path.resolve(__dirname, './app/mouse/index.html'),
                dna: path.resolve(__dirname, './app/dna/index.html')
                // Add more entry points here if needed
            },
            output: {
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            }
        }
    },

    // Add plugins if needed (e.g., Vue, React, etc.)
    plugins: [
        // ...Your plugins here
    ],

    // Enable server options for development (optional)
    server: {
        // Server-specific configurations
        port: 3000, // Custom port for local dev server
        open: true, // Open the browser on server start
        // Proxy configuration if you need to call an API
        proxy: {
            // '/api': 'http://localhost:8000',
        }
    },

    // Enable additional options if needed
    // e.g., CSS pre-processing, legacy browser support, etc.
});
