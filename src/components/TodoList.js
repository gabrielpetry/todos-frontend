import React, { useState, useCallback, useEffect } from "react";
import "./TodoList.css";
import "./parts/listItem.css";
import api from "../services/todoApi";

export default function TodoList() {
  const [book, setBook] = useState({});
  const [bookTasks, setBookTasks] = useState([]);
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const response = await api.get("/api/books");
    const books = response.data.books;
    setBooks(books);
    return books;
  };

  const loadBookTasks = async (book) => {
    const res = await api.get(`/api/books/${book._id}/tasks`);
    console.log(res.data.tasks);
    setBookTasks(res.data.tasks);
  };

  useEffect(() => {
    loadBooks().then((b) => {
      setBook(b[0]);
    });
  }, []);

  useEffect(() => {
    // console.log(book);
    loadBookTasks(book);
  }, [book]);

  const toggleTask = useCallback(
    (task) => (event) => {
      console.log("task", task);
      api
        .put(`/api/books/${book._id}/tasks/${task._id}`, {
          description: task.description,
          completed: !task.completed,
        })
        .then((res) => {
          if (res.status === 200) {
            const newTodos = bookTasks.map((t) => {
              if (t._id === task._id) {
                t.completed = !t.completed;
              }
              return t;
            });
            setBookTasks(newTodos);
          }
        });
    },
    [book._id, bookTasks]
  );

  const addBook = useCallback((event) => {
    const name = window.prompt("What the book name?");
    const description = window.prompt("What the pourpose of this book?");
    api
      .post("/api/books", {
        description,
        name,
        active: true,
      })
      .then((res) => {
        if (res.status === 201) {
          loadBooks();
        }
      });
  }, []);

  const addTask = useCallback(
    (event) => {
      const description = window.prompt("What you have to do?");
      api
        .post(`/api/books/${book._id}/tasks`, {
          description,
          completed: true,
        })
        .then((res) => {
          if (res.status === 201) {
            loadBookTasks(book);
          }
        });
    },
    [book]
  );

  const removeTask = useCallback(
    (book_id, task_id) => (event) => {
      api.delete(`/api/books/${book_id}/tasks/${task_id}`).then((res) => {
        if (res.status === 200) {
          const newTodos = bookTasks.filter((t) => t._id !== task_id);
          setBookTasks(newTodos);
        }
      });
    },
    [bookTasks]
  );

  return (
    <div>
      <div className="header">
        <h1>Books</h1>
      </div>

      {books.length &&
        books.map((book) => (
          <span onClick={() => setBook(book)} class="book active">
            {book.name}
          </span>
        ))}

      <button onClick={addBook}>+</button>

      <ul class="task-list">
        {bookTasks.length &&
          bookTasks.map((task) => (
            <li
              key={task._id}
              className={task.completed ? "completed" : "notCompleted"}
            >
              <div class="form-inline">
                <input
                  class="round-checkbox"
                  checked={task.completed}
                  type="checkbox"
                  id="checkbox"
                  onChange={toggleTask(task)}
                />
                <label>{task.description}</label>
              </div>
              <button onClick={removeTask(book._id, task._id)}>delete</button>
            </li>
          ))}
        <li>
          <button className="add-task" onClick={addTask}>
            +
          </button>
        </li>
      </ul>
    </div>
  );
}
