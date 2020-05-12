import React, { useState, useCallback, useEffect } from "react";
import "./TodoList.css";
import "./parts/listItem.css";
import api from "../services/todoApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export default function TodoList() {
  const [book, setBook] = useState({});
  const [bookTasks, setBookTasks] = useState([]);
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const response = await api.getBooks();
    const books = response.data.books;
    if (books) {
      setBooks(books);
      return books;
    }
  };

  const loadBookTasks = async (book) => {
    if (!book._id) return;
    const res = await api.getBookTasks(book._id);
    setBookTasks(res.data.tasks);
  };

  useEffect(() => {
    loadBooks().then((b) => {
      if (b[0]) {
        setBook(b[0]);
      }
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

  const removeBook = useCallback(
    (book_id) => (event) => {
      api.deleteBook(book_id).then((res) => {
        if (res.status !== 204) return;
        const newBooks = books.filter((t) => t._id !== book_id);
        setBooks(newBooks);
        setBook(books[0]);
      });
    },
    [books]
  );

  return (
    <div>
      <div className="header">
        <h1>{book.name}</h1>
        <div className="actions">
          <FontAwesomeIcon
            onClick={removeBook(book._id)}
            className="remove-book"
            icon={faTimesCircle}
          />
        </div>
      </div>

      <div className="books-list">
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

        <span className="add-book">
          <FontAwesomeIcon onClick={addBook} icon={faPlusCircle} />
        </span>
      </div>

      <ul className="task-list">
        {bookTasks.length &&
          bookTasks.map((task) => (
            <li
              key={task._id}
              className={task.completed ? "completed" : "notCompleted"}
            >
              <div className="task-inline">
                <div className="task-info">
                  <input
                    className="round-checkbox"
                    checked={task.completed}
                    type="checkbox"
                    id="checkbox"
                    onChange={toggleTask(task)}
                  />
                  <label>{task.description}</label>
                </div>
                <FontAwesomeIcon
                  onClick={removeTask(book._id, task._id)}
                  className="remove-book"
                  icon={faTimesCircle}
                />
              </div>
            </li>
          ))}
        <li>
          <FontAwesomeIcon
            className="add-task"
            onClick={addTask}
            icon={faPlusCircle}
          />
        </li>
      </ul>
    </div>
  );
}
