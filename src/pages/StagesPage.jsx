import { useState } from 'react'
import { Plus, Pencil, Trash2, GripVertical, Check, X } from 'lucide-react'
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useApp } from '../context/AppContext'

const COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#14b8a6','#f97316','#64748b']

function StageRow({ stage, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stage.id })
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(stage.name)
  const [color, setColor] = useState(stage.color)

  const handleSave = async () => {
    await onEdit(stage.id, { name, color })
    setEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3"
    >
      <button {...attributes} {...listeners} className="text-gray-300 dark:text-gray-600 cursor-grab">
        <GripVertical size={16} />
      </button>

      {editing ? (
        <>
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                style={{ backgroundColor: c, borderColor: color === c ? '#fff' : c, outline: color === c ? `2px solid ${c}` : 'none' }}
              />
            ))}
          </div>
          <input
            className="input flex-1 py-1.5 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button onClick={handleSave} className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
            <Check size={14} />
          </button>
          <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X size={14} />
          </button>
        </>
      ) : (
        <>
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
          <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{stage.name}</span>
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(stage.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500">
            <Trash2 size={14} />
          </button>
        </>
      )}
    </div>
  )
}

export default function StagesPage() {
  const { stages, addStage, updateStage, deleteStage, reorderStages } = useApp()
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleAdd = async () => {
    if (!newName.trim()) return
    await addStage({ name: newName.trim(), color: newColor })
    setNewName('')
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu aşama silinecek. İçindeki tasklar aşamasız kalır. Emin misiniz?')) return
    await deleteStage(id)
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIdx = stages.findIndex((s) => s.id === active.id)
    const newIdx = stages.findIndex((s) => s.id === over.id)
    reorderStages(arrayMove(stages, oldIdx, newIdx))
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Aşamalar</h1>
        <p className="text-xs text-gray-400">Kanban sütunlarını özelleştirin ve sıralayın</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-xl space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stages.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {stages.map((stage) => (
              <StageRow
                key={stage.id}
                stage={stage}
                onEdit={updateStage}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Yeni aşama */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 px-4 py-3">
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                style={{ backgroundColor: c, borderColor: newColor === c ? '#fff' : c, outline: newColor === c ? `2px solid ${c}` : 'none' }}
              />
            ))}
          </div>
          <input
            className="input flex-1 py-1.5 text-sm"
            placeholder="Yeni aşama adı..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="btn-primary py-1.5 px-3">
            <Plus size={15} /> Ekle
          </button>
        </div>
      </div>
    </div>
  )
}
