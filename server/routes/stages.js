import { Router } from 'express'
import { pool } from '../db.js'

export default function stagesRouter(io) {
  const router = Router()

  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM stages ORDER BY position')
      res.json(rows)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.post('/', async (req, res) => {
    const { name, color } = req.body
    try {
      const { rows: [maxRow] } = await pool.query('SELECT COALESCE(MAX(position), -1) as max FROM stages')
      const position = maxRow.max + 1
      const { rows } = await pool.query(
        'INSERT INTO stages (name, color, position) VALUES ($1, $2, $3) RETURNING *',
        [name, color, position]
      )
      io.emit('stages:change')
      res.status(201).json(rows[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.patch('/:id', async (req, res) => {
    const { id } = req.params
    const { name, color, position } = req.body
    try {
      const { rows } = await pool.query(
        `UPDATE stages SET
          name     = COALESCE($1, name),
          color    = COALESCE($2, color),
          position = COALESCE($3, position)
         WHERE id = $4 RETURNING *`,
        [name, color, position, id]
      )
      io.emit('stages:change')
      res.json(rows[0])
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM stages WHERE id = $1', [req.params.id])
      io.emit('stages:change')
      res.status(204).end()
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // Toplu sıra güncelleme (sürükle-bırak)
  router.post('/reorder', async (req, res) => {
    const { orderedIds } = req.body // [{id, position}]
    try {
      await Promise.all(
        orderedIds.map(({ id, position }) =>
          pool.query('UPDATE stages SET position = $1 WHERE id = $2', [position, id])
        )
      )
      io.emit('stages:change')
      res.status(204).end()
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  return router
}
