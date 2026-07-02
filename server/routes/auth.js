import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function issueToken(res, user) {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('token', token, COOKIE_OPTIONS)
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body ?? {}
    if (!email || !password || !name) {
      return res.status(400).json({ message: '請填寫姓名、email 與密碼' })
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'email 格式不正確' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: '密碼至少需要 8 個字元' })
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(409).json({ message: '這個 email 已經被註冊過了' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const [result] = await pool.query('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [
      email,
      passwordHash,
      name,
    ])

    const user = { id: result.insertId, email, name }
    issueToken(res, user)
    res.status(201).json({ user })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '這個 email 已經被註冊過了' })
    }
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
      return res.status(400).json({ message: '請輸入 email 與密碼' })
    }

    const [rows] = await pool.query('SELECT id, email, name, password_hash FROM users WHERE email = ?', [email])
    const row = rows[0]
    if (!row || !(await bcrypt.compare(password, row.password_hash))) {
      return res.status(401).json({ message: 'email 或密碼錯誤' })
    }

    const user = { id: row.id, email: row.email, name: row.name }
    issueToken(res, user)
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS)
  res.status(204).end()
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email, name: req.user.name } })
})

export default router
