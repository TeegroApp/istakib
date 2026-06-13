import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [stages, setStages] = useState([])
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [stagesRes, tasksRes, catsRes] = await Promise.all([
      supabase.from('stages').select('*').order('position'),
      supabase.from('tasks').select('*').eq('archived', false).order('position'),
      supabase.from('categories').select('*').order('level').order('name'),
    ])
    if (stagesRes.data) setStages(stagesRes.data)
    if (tasksRes.data) setTasks(tasksRes.data)
    if (catsRes.data) setCategories(catsRes.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()

    const tasksSub = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stages' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchAll)
      .subscribe()

    return () => supabase.removeChannel(tasksSub)
  }, [fetchAll])

  // --- Aşama işlemleri ---
  const addStage = async (data) => {
    const maxPos = stages.reduce((m, s) => Math.max(m, s.position), -1)
    const { error } = await supabase.from('stages').insert({ ...data, position: maxPos + 1 })
    if (error) throw error
  }

  const updateStage = async (id, data) => {
    const { error } = await supabase.from('stages').update(data).eq('id', id)
    if (error) throw error
  }

  const deleteStage = async (id) => {
    const { error } = await supabase.from('stages').delete().eq('id', id)
    if (error) throw error
  }

  const reorderStages = async (newStages) => {
    setStages(newStages)
    await Promise.all(
      newStages.map((s, i) => supabase.from('stages').update({ position: i }).eq('id', s.id))
    )
  }

  // --- Task işlemleri ---
  const addTask = async (data) => {
    const stageTasks = tasks.filter((t) => t.stage_id === data.stage_id)
    const maxPos = stageTasks.reduce((m, t) => Math.max(m, t.position), -1)
    const { error } = await supabase.from('tasks').insert({ ...data, position: maxPos + 1 })
    if (error) throw error
  }

  const updateTask = async (id, data) => {
    const { error } = await supabase.from('tasks').update(data).eq('id', id)
    if (error) throw error
  }

  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
  }

  const archiveTask = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .update({ archived: true, archived_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }

  const unarchiveTask = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .update({ archived: false, archived_at: null })
      .eq('id', id)
    if (error) throw error
  }

  const moveTask = async (taskId, newStageId, newPosition) => {
    const { error } = await supabase
      .from('tasks')
      .update({ stage_id: newStageId, position: newPosition })
      .eq('id', taskId)
    if (error) throw error
  }

  // --- Kategori işlemleri ---
  const addCategory = async (data) => {
    const { error } = await supabase.from('categories').insert(data)
    if (error) throw error
  }

  const updateCategory = async (id, data) => {
    const { error } = await supabase.from('categories').update(data).eq('id', id)
    if (error) throw error
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  }

  return (
    <AppContext.Provider
      value={{
        stages, tasks, categories, loading,
        theme, setTheme,
        addStage, updateStage, deleteStage, reorderStages,
        addTask, updateTask, deleteTask, archiveTask, unarchiveTask, moveTask,
        addCategory, updateCategory, deleteCategory,
        refetch: fetchAll,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
