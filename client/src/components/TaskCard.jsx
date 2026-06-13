import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Tag, AlertCircle, Pencil, Archive } from 'lucide-react'

const PRIORITY_STYLES = {
  düşük:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  orta:   'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  yüksek: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  acil:   'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
}

export default function TaskCard({ task, categoryColor, categoryName, onEdit, onArchive }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.archived

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
      {...attributes}
      {...listeners}
    >
      {/* Renk çizgisi */}
      {categoryColor && (
        <div
          className="h-0.5 w-8 rounded-full mb-2.5"
          style={{ backgroundColor: categoryColor }}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug flex-1">
          {task.title}
        </p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onEdit(task) }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Pencil size={13} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onArchive(task.id) }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Archive size={13} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {task.priority && task.priority !== 'orta' && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority}
          </span>
        )}

        {categoryName && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
            style={{ backgroundColor: categoryColor || '#6b7280' }}
          >
            {categoryName}
          </span>
        )}

        {task.tags?.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            <Tag size={9} />
            {tag}
          </span>
        ))}

        {task.due_date && (
          <span
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
              isOverdue
                ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {isOverdue ? <AlertCircle size={10} /> : <Calendar size={10} />}
            {new Date(task.due_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  )
}
