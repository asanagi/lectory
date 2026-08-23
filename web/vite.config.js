import { resolve } from 'node:path'
import { defineConfig } from 'vite'

function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx || !ctx.bundle) return html;
      let newHtml = html;
      for (const [fileName, file] of Object.entries(ctx.bundle)) {
        if (fileName.endsWith('.css') && file.type === 'asset') {
          const cssContent = file.source.toString();
          // Match any link tag referencing this stylesheet asset
          const linkRegex = new RegExp(`<link[^>]*href="[^"]*${fileName.replace(/^assets\//, '')}[^"]*"[^>]*>|<link[^>]*href="[^"]*${fileName}"[^>]*>`, 'gi');
          newHtml = newHtml.replace(linkRegex, `<style>${cssContent}</style>`);
        }
      }
      return newHtml;
    },
  }
}

export default defineConfig({
  plugins: [inlineCss()],
  server: {
    port: 8080,
    strictPort: true,
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        features: resolve(__dirname, 'features.html'),
        solutions: resolve(__dirname, 'solutions.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        tos: resolve(__dirname, 'tos.html'),
        terms: resolve(__dirname, 'terms.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
})
