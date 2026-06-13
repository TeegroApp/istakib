import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Plus, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Column from '../components/Column'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'

export default function BoardPage() {
  const { stages, tasks, categories, loading, archiveTask, moveTask } = useApp()
  const [activeTask, setActiveTask] = useState(null)
  const [modal, setModal] = useState(null) // { task?, stageId? }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const tasksByStage = (stageId) =>
    tasks
      .filter((t) => t.stage_id === stageId)
      .sort((a, b) => a.position - b.position)

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t.id === active.id) || null)
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null)
    if (!over) return

    const taskId = active.id
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // over bir stage mi yoksa task mi?
    const overIsStage = stages.some((s) => s.id === over.id)
    const targetStageId = overIsStage
      ? over.id
      : tasks.find((t) => t.id === over.id)?.stage_id

    if (!targetStageId) return

    const stageTasks = tasksByStage(targetStageId)

    let newPosition
    if (overIsStage) {
      newPosition = stageTasks.length
    } else {
      const overIdx = stageTasks.findIndex((t) => t.id === over.id)
      newPosition = overIdx >= 0 ? overIdx : stageTasks.length
    }

    await moveTask(taskId, targetStageId, newPosition)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    )
  }

  const activeTaskCat = activeTask?.category_id
    ? categories.find((c) => c.id === activeTask.category_id)
    : null

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Üst bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Pano</h1>
          <p className="text-xs text-gray-400">{tasks.length} aktif task</p>
        </div>
        <button
          onClick={() => setModal({ stageId: stages[0]?.id })}
          className="btn-primary"
        >
          <Plus size={15} /> Yeni Task
        </button>
      </div>

      {/* Kanban */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <div className="flex gap-5 min-w-max items-start">
            {stages.map((stage) => (
              <Column
                key={stage.id}
                stage={stage}
                tasks={tasksByStage(stage.id)}
                categories={categories}
                onAddTask={(stageId) => setModal({ stageId })}
                onEditTask={(task) => setModal({ task })}
                onArchiveTask={archiveTask}
              />
            ))}

            {stages.length === 0 && (
              <div className="flex items-center justify-center w-full h-64 text-gray-400">
                Henüz aşama yok. Aşamalar sayfasından ekleyebilirsiniz.
              </div>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              categoryColor={activeTaskCat?.color}
              categoryName={activeTaskCat?.name}
              onEdit={() => {}}
              onArchive={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal.task}
          defaultStageId={modal.stageId}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
