import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PRIORITIES = ['düşük', 'orta', 'yüksek', 'acil']

export default function TaskModal({ task, defaultStageId, onClose }) {
  const { stages, categories, addTask, updateTask, deleteTask } = useApp()
  const [form, setForm] = useState({
    title: '',
    description: '',
    stage_id: defaultStageId || stages[0]?.id || '',
    category_id: '',
    priority: 'orta',
    due_date: '',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        stage_id: task.stage_id || '',
        category_id: task.category_id || '',
        priority: task.priority || 'orta',
        due_date: task.due_date || '',
        tags: task.tags || [],
      })
    }
  }, [task])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }

  const removeTag = (tag) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Başlık zorunlu'); return }
    setSaving(true)
    setError('')
    try {
      const data = {
        ...form,
        category_id: form.category_id || null,
        due_date: form.due_date || null,
      }
      if (task) await updateTask(task.id, data)
      else await addTask(data)
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu task silinecek. Emin misiniz?')) return
    setSaving(true)
    try {
      await deleteTask(task.id)
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // Hiyerarşik kategori listesi
  const mainCats = categories.filter((c) => c.level === 1)
  const subCats = (parentId) => categories.filter((c) => c.level === 2 && c.parent_id === parentId)
  const leafCats = (parentId) => categories.filter((c) => c.level === 3 && c.parent_id === parentId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {task ? 'Task Düzenle' : 'Yeni Task'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div>
            <label className="label">Başlık *</label>
            <input
              className="input"
              placeholder="Task başlığı..."
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="label">Açıklama</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Detaylar..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Aşama</label>
              <select className="input" value={form.stage_id} onChange={(e) => set('stage_id', e.target.value)}>
                {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Öncelik</label>
              <select className="input" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Kategori</label>
            <select className="input" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">— Kategori Yok —</option>
              {mainCats.map((main) => (
                <optgroup key={main.id} label={main.name}>
                  <option value={main.id}>{main.name}</option>
                  {subCats(main.id).map((sub) => (
                    <>
                      <option key={sub.id} value={sub.id}>  {sub.name}</option>
                      {leafCats(sub.id).map((leaf) => (
                        <option key={leaf.id} value={leaf.id}>    {leaf.name}</option>
                      ))}
                    </>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Son Tarih</label>
            <input
              type="date"
              className="input"
              value={form.due_date}
              onChange={(e) => set('due_date', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Etiketler</label>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Etiket ekle..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button onClick={addTag} className="btn-secondary px-3">
                <Plus size={15} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <div>
            {task && (
              <button onClick={handleDelete} disabled={saving} className="btn-danger">
                <Trash2 size={14} /> Sil
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary">İptal</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Kaydediliyor...' : task ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
