import { useState, useEffect, useRef } from 'react'
import './App.css'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

type FilterType = 'all' | 'active' | 'completed'

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingId])

  const addTodo = () => {
    const text = inputValue.trim()
    if (!text) return
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now()
    }
    setTodos(prev => [newTodo, ...prev])
    setInputValue('')
  }

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditValue(todo.text)
  }

  const saveEdit = () => {
    if (editingId === null) return
    const text = editValue.trim()
    if (!text) {
      setEditingId(null)
      return
    }
    setTodos(prev =>
      prev.map(todo =>
        todo.id === editingId ? { ...todo, text } : todo
      )
    )
    setEditingId(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const totalCount = todos.length
  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📝 Todo List</h1>
          <p className="subtitle">高效管理你的每一天</p>
        </header>

        <div className="input-section">
          <input
            type="text"
            className="todo-input"
            placeholder="添加新的待办事项..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button className="add-btn" onClick={addTodo}>
            添加
          </button>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{totalCount}</span>
            <span className="stat-label">总计</span>
          </div>
          <div className="stat-item active">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">进行中</span>
          </div>
          <div className="stat-item completed">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">已完成</span>
          </div>
        </div>

        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            进行中
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            已完成
          </button>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              清除已完成
            </button>
          )}
        </div>

        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">
              {filter === 'all'
                ? '🎉 还没有待办事项，添加一个吧！'
                : filter === 'active'
                ? '✅ 所有任务都已完成！'
                : '📋 还没有已完成的任务'}
            </li>
          ) : (
            filteredTodos.map(todo => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''} ${
                  editingId === todo.id ? 'editing' : ''
                }`}
              >
                <div className="todo-content">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  {editingId === todo.id ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      className="edit-input"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit()
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      onBlur={saveEdit}
                    />
                  ) : (
                    <span
                      className="todo-text"
                      onDoubleClick={() => startEdit(todo)}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>
                <div className="todo-actions">
                  {editingId !== todo.id && (
                    <button
                      className="action-btn edit-btn"
                      onClick={() => startEdit(todo)}
                      title="编辑"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                    title="删除"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <footer className="footer">
          <p>双击任务可编辑 • 按 Enter 保存 • 按 Esc 取消</p>
        </footer>
      </div>
    </div>
  )
}

export default App
