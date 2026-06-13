import { Router } from 'express'
import { pool } from '../db.js'

export default function tasksRouter(io) {
  const router = Router()

  router.get('/', async (req, res) => {
    const archived = req.query.archived === 'true'
    try {
      const { rows } = await pool.query(
        'SELECT * FROM tasks WHERE archived = $1 ORDER BY position',
        [archived]
      )
      res.json(rows)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.post('/', async (req, res) => {
    const { title, description, stage_id, category_id, priority, due_date, tags } = req.body
    try {
      const { rows: [maxRow] } = await pool.query(
        'SELECT COALESCE(MAX(position), -1) as max FROM tasks WHERE stage_id = $1 AND archived = false',
        [stage_id]
      )
      const position = maxRow.max + 1
      const { rows } = await pool.query(
        `INSERT INTO tasks (title, description, stage_id, category_id, priority, due_date, tags, position)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, description || null, stage_id, category_id || null, priority || 'orta', due_date || null, tags || [], position]
      )
      io.emit('tasks:change')
      res.status(201).json(rows[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.patch('/:id', async (req, res) => {
    const { id } = req.params
    const fields = req.body
    const keys = Object.keys(fields)
    if (keys.length === 0) return res.status(400).json({ error: 'No fields to update' })

    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
    const values = keys.map((k) => fields[k])

    try {
      const { rows } = await pool.query(
        `UPDATE tasks SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
        [...values, id]
      )
      io.emit('tasks:change')
      res.json(rows[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
      io.emit('tasks:change')
      res.status(204).end()
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // Task taşıma (sürükle-bırak)
  router.post('/:id/move', async (req, res) => {
    const { id } = req.params
    const { stage_id, position } = req.body
    try {
      const { rows } = await pool.query(
        'UPDATE tasks SET stage_id = $1, position = $2 WHERE id = $3 RETURNING *',
        [stage_id, position, id]
      )
      io.emit('tasks:change')
      res.json(rows[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // Arşivle / geri al
  router.post('/:id/archive', async (req, res) => {
    const { archive } = req.body // true | false
    try {
      const { rows } = await pool.query(
        `UPDATE tasks SET archived = $1, archived_at = $2 WHERE id = $3 RETURNING *`,
        [archive, archive ? new Date().toISOString() : null, req.params.id]
      )
      io.emit('tasks:change')
      res.json(rows[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  return router
}
