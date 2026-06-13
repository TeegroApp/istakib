const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Sunucu hatası')
  return data
}

export const api = {
  // Stages
  getStages: () => request('/stages'),
  addStage: (data) => request('/stages', { method: 'POST', body: data }),
  updateStage: (id, data) => request(`/stages/${id}`, { method: 'PATCH', body: data }),
  deleteStage: (id) => request(`/stages/${id}`, { method: 'DELETE' }),
  reorderStages: (orderedIds) => request('/stages/reorder', { method: 'POST', body: { orderedIds } }),

  // Tasks
  getTasks: (archived = false) => request(`/tasks?archived=${archived}`),
  addTask: (data) => request('/tasks', { method: 'POST', body: data }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PATCH', body: data }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  moveTask: (id, stage_id, position) =>
    request(`/tasks/${id}/move`, { method: 'POST', body: { stage_id, position } }),
  archiveTask: (id) =>
    request(`/tasks/${id}/archive`, { method: 'POST', body: { archive: true } }),
  unarchiveTask: (id) =>
    request(`/tasks/${id}/archive`, { method: 'POST', body: { archive: false } }),

  // Categories
  getCategories: () => request('/categories'),
  addCategory: (data) => request('/categories', { method: 'POST', body: data }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PATCH', body: data }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
}
