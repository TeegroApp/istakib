import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

const COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#14b8a6','#f97316','#64748b','#84cc16','#0ea5e9']

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLORS.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className="w-5 h-5 rounded-full transition-transform hover:scale-110"
          style={{
            backgroundColor: c,
            outline: value === c ? `2px solid ${c}` : 'none',
            outlineOffset: '2px',
          }}
        />
      ))}
    </div>
  )
}

function InlineEdit({ item, onSave, onCancel }) {
  const [name, setName] = useState(item?.name || '')
  const [color, setColor] = useState(item?.color || COLORS[0])

  return (
    <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <ColorPicker value={color} onChange={setColor} />
      <div className="flex gap-2">
        <input
          className="input flex-1 py-1.5 text-sm"
          placeholder="Kategori adı..."
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave({ name, color })}
        />
        <button onClick={() => onSave({ name, color })} className="btn-primary py-1.5 px-2.5"><Check size={14} /></button>
        <button onClick={onCancel} className="btn-secondary py-1.5 px-2.5"><X size={14} /></button>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp()

  const [editing, setEditing] = useState(null) // { id }
  const [adding, setAdding] = useState(null) // { parentId, level }

  const mainCats = categories.filter((c) => c.level === 1)
  const subCats = (pid) => categories.filter((c) => c.level === 2 && c.parent_id === pid)
  const leafCats = (pid) => categories.filter((c) => c.level === 3 && c.parent_id === pid)

  const handleAdd = async ({ name, color }) => {
    if (!name.trim()) return
    await addCategory({ name: name.trim(), color, parent_id: adding.parentId || null, level: adding.level })
    setAdding(null)
  }

  const handleUpdate = async ({ name, color }) => {
    if (!name.trim()) return
    await updateCategory(editing, { name: name.trim(), color })
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu kategori ve alt kategorileri silinecek. Emin misiniz?')) return
    await deleteCategory(id)
  }

  const catItem = (cat, indent = 0) => {
    const isEditing = editing === cat.id
    return (
      <div key={cat.id}>
        {isEditing ? (
          <div style={{ marginLeft: indent }}>
            <InlineEdit
              item={cat}
              onSave={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          </div>
        ) : (
          <div
            className="flex items-center gap-2 group py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
            style={{ paddingLeft: `${12 + indent}px` }}
          >
            {indent > 0 && <ChevronRight size={12} className="text-gray-300 dark:text-gray-600 shrink-0" />}
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{cat.name}</span>
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              {cat.level < 3 && (
                <button
                  onClick={() => setAdding({ parentId: cat.id, level: cat.level + 1 })}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-indigo-500 text-xs"
                  title="Alt kategori ekle"
                >
                  <Plus size={12} />
                </button>
              )}
              <button onClick={() => setEditing(cat.id)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <Pencil size={12} />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Alt kategoriler */}
        {cat.level === 1 && subCats(cat.id).map((sub) => (
          <div key={sub.id}>
            {catItem(sub, 16)}
            {leafCats(sub.id).map((leaf) => catItem(leaf, 32))}
            {adding?.parentId === sub.id && (
              <div style={{ paddingLeft: '48px' }}>
                <InlineEdit onSave={handleAdd} onCancel={() => setAdding(null)} />
              </div>
            )}
          </div>
        ))}

        {cat.level === 1 && adding?.parentId === cat.id && (
          <div style={{ paddingLeft: '28px' }}>
            <InlineEdit onSave={handleAdd} onCancel={() => setAdding(null)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Kategoriler</h1>
          <p className="text-xs text-gray-400">Ana kategori → Alt kategori → Kategori (3 seviye)</p>
        </div>
        <button onClick={() => setAdding({ parentId: null, level: 1 })} className="btn-primary">
          <Plus size={15} /> Ana Kategori
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-xl space-y-1">
        {adding?.level === 1 && (
          <InlineEdit onSave={handleAdd} onCancel={() => setAdding(null)} />
        )}

        {mainCats.length === 0 && !adding && (
          <p className="text-center text-gray-400 mt-16 text-sm">
            Henüz kategori yok. "Ana Kategori" butonuyla başlayın.
          </p>
        )}

        {mainCats.map((main) => catItem(main, 0))}
      </div>
    </div>
  )
}
