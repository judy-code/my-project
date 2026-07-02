import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// GITHUB_REPOSITORY 是 GitHub Actions 內建的環境變數（格式 帳號/repo名稱），
// 只有在 CI 上跑 build 時才會有值；本機 build 拿不到就 fallback 用目前的 repo 名稱。
// 這樣以後在 GitHub 上改 repo 名稱，不用回來改這裡，下次部署會自動套用新名稱。
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'cotrace'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages 專案頁面網址是 https://<帳號>.github.io/<repo名稱>/，
  // 所以 build 出來的資源路徑要加上 repo 名稱這個子路徑；本機開發時維持 '/' 即可
  base: command === 'build' ? `/${repoName}/` : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
}))
