import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'

if (!process.env.JWT_SECRET) {
  console.error('缺少 JWT_SECRET，請在 .env 設定一組隨機長字串後再啟動伺服器')
  process.exit(1)
}

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: '伺服器發生錯誤，請稍後再試' })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`API server ready on http://localhost:${port}`))
