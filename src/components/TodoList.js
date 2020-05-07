import React, { useState, useCallback, useEffect } from "react";
import "./TodoList.css";
import "./parts/listItem.css";
import api from "../services/todoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function TodoList() {
  const [book, setBook] = useState({});
  const [bookTasks, setBookTasks] = useState([]);
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const response = await api.getBooks();
    const books = response.data.books;
    setBooks(books);
    return books;
  };

  const loadBookTasks = async (book) => {
    if (!book._id) return;
    const res = await api.getBookTasks(book._id);
    setBookTasks(res.data.tasks);
  };

  useEffect(() => {
    loadBooks().then((b) => {
      setBook(b[0]);
    });
  }, []);

  useEffect(() => {
    loadBookTasks(book);
  }, [book]);

  const toggleTask = useCallback(
    (task) => (event) => {
      api.updateOne(book._id, task).then((res) => {
        if (res.status !== 200) return;
        // if update succeses locally update the list
        const newTodos = bookTasks.map((t) => {
          if (t._id === task._id) {
            t.completed = !t.completed;
          }
          return t;
        });
        setBookTasks(newTodos);
      });
    },
    [book._id, bookTasks]
  );

  const addBook = useCallback((event) => {
    const name = window.prompt("What the book name?");
    const description = window.prompt("What the pourpose of this book?");
    api.createBook({ description, name, active: true }).then((res) => {
      if (res.status !== 201) return;
      loadBooks();
    });
  }, []);

  const addTask = useCallback(
    (event) => {
      const description = window.prompt("What you have to do?");
      api
        .createTask(book._id, { description, completed: false })
        .then((res) => {
          if (res.status !== 201) return;
          loadBookTasks(book);
        });
    },
    [book]
  );

  const removeTask = useCallback(
    (book_id, task_id) => (event) => {
      api.deleteTask(book_id, task_id).then((res) => {
        if (res.status !== 200) return;
        const newTodos = bookTasks.filter((t) => t._id !== task_id);
        setBookTasks(newTodos);
      });
    },
    [bookTasks]
  );

  return (
    <div>
      <div className="header">
        <h1>{book.name}</h1>
      </div>

      {books.length &&
        books.map((b) => (
          <span
            key={b._id}
            onClick={() => setBook(b)}
            className={b._id === book._id ? "book active" : "book"}
          >
            {b.name}
          </span>
        ))}

      <button onClick={addBook} className="book">
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <ul className="task-list">
        {bookTasks.length &&
          bookTasks.map((task) => (
            <li
              key={task._id}
              className={task.completed ? "completed" : "notCompleted"}
            >
              <div className="form-inline">
                <input
                  className="round-checkbox"
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
