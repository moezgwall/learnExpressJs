import { defineConfig } from 'vite';

// root : should contain HTML file (folder : main)
// build.outDir : output prod
export default defineConfig({
    root: './main',
    build: {
        outDir: '../dist',
    },
});