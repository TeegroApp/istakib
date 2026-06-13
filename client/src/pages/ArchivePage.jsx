import { useState, useEffect } from 'react'
import { Search, RotateCcw, Trash2, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { useApp } from '../context/AppContext'

export default function ArchivePage() {
  const { categories, stages } = useApp()
  const [archivedTasks, setArchivedTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchArchived = async () => {
    setLoading(true)
    const data = await api.getTasks(true)
    setArchivedTasks(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchArchived() }, [])

  const filtered = archivedTasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || ''
  const getStageName = (id) => stages.find((s) => s.id === id)?.name || ''

  const handleUnarchive = async (id) => {
    await api.unarchiveTask(id)
    setArchivedTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu task kalıcı olarak silinecek. Emin misiniz?')) return
    await api.deleteTask(id)
    setArchivedTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Arşiv</h1>
          <p className="text-xs text-gray-400">{archivedTasks.length} tamamlanan task</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            className="input pl-9 w-56"
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center mt-16">
            <Loader2 className="animate-spin text-indigo-500" size={28} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 mt-16">
            {search ? 'Sonuç bulunamadı.' : 'Arşivde henüz task yok.'}
          </p>
        ) : (
          <div className="space-y-2 max-w-2xl">
            {filtered.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate">{task.title}</p>
                  <div className="flex gap-2 mt-0.5 text-xs text-gray-400">
                    {getStageName(task.stage_id) && <span>{getStageName(task.stage_id)}</span>}
                    {getCategoryName(task.category_id) && <span>· {getCategoryName(task.category_id)}</span>}
                    {task.archived_at && (
                      <span>· {new Date(task.archived_at).toLocaleDateString('tr-TR')}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handleUnarchive(task.id)}
                    className="btn-secondary py-1.5 px-2.5 text-xs"
                  >
                    <RotateCcw size={13} /> Geri Al
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="btn-danger py-1.5 px-2.5 text-xs"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
