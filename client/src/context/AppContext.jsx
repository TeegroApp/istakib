import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { api } from '../lib/api'

const AppContext = createContext(null)

const socket = io({ transports: ['websocket'] })

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
    const [s, t, c] = await Promise.all([
      api.getStages(),
      api.getTasks(false),
      api.getCategories(),
    ])
    setStages(s)
    setTasks(t)
    setCategories(c)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()

    socket.on('stages:change', fetchAll)
    socket.on('tasks:change', fetchAll)
    socket.on('categories:change', fetchAll)

    return () => {
      socket.off('stages:change', fetchAll)
      socket.off('tasks:change', fetchAll)
      socket.off('categories:change', fetchAll)
    }
  }, [fetchAll])

  // --- Aşamalar ---
  const addStage = (data) => api.addStage(data)
  const updateStage = (id, data) => api.updateStage(id, data)
  const deleteStage = (id) => api.deleteStage(id)
  const reorderStages = async (newStages) => {
    setStages(newStages) // optimistic
    await api.reorderStages(newStages.map((s, i) => ({ id: s.id, position: i })))
  }

  // --- Tasklar ---
  const addTask = (data) => api.addTask(data)
  const updateTask = (id, data) => api.updateTask(id, data)
  const deleteTask = (id) => api.deleteTask(id)
  const archiveTask = (id) => api.archiveTask(id)
  const unarchiveTask = (id) => api.unarchiveTask(id)
  const moveTask = (id, stage_id, position) => api.moveTask(id, stage_id, position)

  // --- Kategoriler ---
  const addCategory = (data) => api.addCategory(data)
  const updateCategory = (id, data) => api.updateCategory(id, data)
  const deleteCategory = (id) => api.deleteCategory(id)

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
