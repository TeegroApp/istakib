import { Router } from 'express'
import { pool } from '../db.js'

export default function categoriesRouter(io) {
  const router = Router()

  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM categories ORDER BY level, name')
      res.json(rows)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.post('/', async (req, res) => {
    const { name, color, parent_id, level } = req.body
    try {
      const { rows } = await pool.query(
        'INSERT INTO categories (name, color, parent_id, level) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, color, parent_id || null, level || 1]
      )
      io.emit('categories:change')
      res.status(201).json(rows[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.patch('/:id', async (req, res) => {
    const { name, color } = req.body
    try {
      const { rows } = await pool.query(
        'UPDATE categories SET name = COALESCE($1, name), color = COALESCE($2, color) WHERE id = $3 RETURNING *',
        [name, color, req.params.id]
      )
      io.emit('categories:change')
      res.json(rows[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id])
      io.emit('categories:change')
      res.status(204).end()
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  return router
}
