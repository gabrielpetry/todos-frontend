import React, {useState, useCallback, useEffect} from 'react'
import './TodoList.css'
import './parts/listItem.css'
import todoApi from '../services/todoApi'
import api from '../services/todoApi'

export default function TodoList() {

  const [todo,
    setTodo] = useState('')
  const [todosArray,
    setTodosArray] = useState([])

  const loadTasks = async () => {
    const response = await todoApi.get('/')
    setTodosArray(response.data)  
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const toggleTask = useCallback((task) => (event) => {
    console.log("task", task)
    api.put(`/${task._id}`, {
      task: task.task,
      completed: !task.completed
    }).then(res => {
      if (res.status == 200) {
        const newTodos = todosArray.map(t => {
          if (t._id == task._id) {
            t.completed = !t.completed
          }
          return t
        })
        setTodosArray(newTodos)
      }
    })
  }, [todosArray])

  const addTask = useCallback((event) => {
    const task = window.prompt('What you need todo?');
    api.post('/', {
      task,
      completed: false
    }).then(res => {
      if (res.status == 201) {
        loadTasks();
      }
    })
  }, [todosArray])

  const removeTask = useCallback((id) => (event) => {
    api.delete(`/${id}`).then(res => {
      if (res.status == 200) {
        const newTodos = todosArray.filter(t => t._id != id)
        setTodosArray(newTodos)
      }
    })
  }, [todosArray])

  return (
    <div>
      <div className="header">
        <h1>Books</h1>

        <button onClick={addTask}>+</button>
      </div>
      <span class='book active'>main</span>

      <ul class="task-list">
        {todosArray.length && todosArray.map(task => (
          <li
            key={task._id}
            className={task.completed ? 'completed'  : 'notCompleted'}
          >
            <div class='form-inline'>
              <input
                class="round-checkbox"
                checked={task.completed}
                type="checkbox"
                id="checkbox"
                onChange={toggleTask(task)}/>
              <label>{task.task}</label>
            </div>
            <button onClick={removeTask(task._id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}