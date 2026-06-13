import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import stagesRouter from './routes/stages.js'
import tasksRouter from './routes/tasks.js'
import categoriesRouter from './routes/categories.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
})

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(express.json())

// API
app.use('/api/stages', stagesRouter(io))
app.use('/api/tasks', tasksRouter(io))
app.use('/api/categories', categoriesRouter(io))

// Sağlık kontrolü
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Prodüksiyonda React build'ini serv et
if (isProd) {
  const clientDist = join(__dirname, '../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (req, res) => res.sendFile(join(clientDist, 'index.html')))
}

io.on('connection', (socket) => {
  console.log('🔌 bağlandı:', socket.id)
  socket.on('disconnect', () => console.log('❌ ayrıldı:', socket.id))
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`)
})
