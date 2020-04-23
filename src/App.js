import React, { useState, useCallback, useEffect } from 'react';
import TodoList from './components/TodoList'
export default () => {
  // hooks!!
  const [newTodo, setnewTodo] = useState('');

  const [todos, settodos] = useState([]);

  const onNewTodoChange = useCallback(
    (event) => {
      setnewTodo(event.target.value)
    },
    [],
  )

  const formSubmmited = useCallback(
    (event) => {
      event.preventDefault()
      if (!newTodo.trim()) return
      settodos([
        {
          id: todos.length ? todos[0].id + 1 : 1,
          content: newTodo,
          done: false
        },
        ...todos
      ])
      setnewTodo('')
    },
    [todos, newTodo],
  )

  useEffect(() => {
    console.log(todos)
  }, [todos])

  useEffect(() => {
    settodos([
      ...todos,
      {
        id: todos.length + 1,
        content: 'test',
        done: false
      }
    ])
  }, [])

  const toggleTodoDone = useCallback((todo, index) => (event) => {
    console.log(event.target.checked)
    const newTodos = [...todos]
    newTodos.splice(index, 1, {
        ...todo,
        done: !todo.done
    })
    console.log("newTodos", newTodos)
    settodos(newTodos)
  }, [todos])

  const removeTodo = useCallback((todo) => (event) => {
    console.log(event.target.checked)
    const newTodos = todos.filter(t => t.id != todo.id)
    settodos(newTodos)
  }, [todos])

  const markAllDone = useCallback(() => {
    const newTodos = todos.map(todo => {
      return {
        ...todo,
        done: true,
      }
    })
    settodos(newTodos)
  }, [todos])

  const removeDone = useCallback(() => {
    const newTodos = todos.filter(todo => todo.done == false )
    settodos(newTodos)
  }, [todos])

  return (
    <div className="App">
      <TodoList></TodoList>
    </div>
  );
}