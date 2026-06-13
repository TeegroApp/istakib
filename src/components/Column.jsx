import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import TaskCard from './TaskCard'

export default function Column({ stage, tasks, categories, onAddTask, onEditTask, onArchiveTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  const getCategoryInfo = (catId) => {
    if (!catId) return {}
    const cat = categories.find((c) => c.id === catId)
    if (!cat) return {}
    const rootCat = cat.level > 1
      ? categories.find((c) => c.id === cat.parent_id) || cat
      : cat
    return { color: rootCat.color, name: cat.name }
  }

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Sütun başlığı */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stage.name}</h2>
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(stage.id)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Yeni task ekle"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Kart listesi */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 min-h-16 rounded-xl p-2 transition-colors ${
          isOver
            ? 'bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-300 dark:ring-indigo-700'
            : 'bg-gray-100/50 dark:bg-gray-800/30'
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => {
            const { color, name } = getCategoryInfo(task.category_id)
            return (
              <TaskCard
                key={task.id}
                task={task}
                categoryColor={color}
                categoryName={name}
                onEdit={onEditTask}
                onArchive={onArchiveTask}
              />
            )
          })}
        </SortableContext>

        {tasks.length === 0 && (
          <button
            onClick={() => onAddTask(stage.id)}
            className="w-full h-16 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-xs hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-400 transition-colors flex items-center justify-center gap-1"
          >
            <Plus size={13} /> Task ekle
          </button>
        )}
      </div>
    </div>
  )
}
