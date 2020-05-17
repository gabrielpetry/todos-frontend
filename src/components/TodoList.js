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
    if (!book.id) return;
    const res = await api.getBookTasks(book.id);
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
      api.updateOne(book.id, task).then((res) => {
        if (res.status !== 200) return;
        // if update succeses locally update the list
        const newTodos = bookTasks.map((t) => {
          if (t.id === task.id) {
            t.completed = !t.completed;
          }
          return t;
        });
        setBookTasks(newTodos);
      });
    },
    [book.id, bookTasks]
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
      api.createTask(book.id, { description, completed: false }).then((res) => {
        if (res.status !== 201) return;
        loadBookTasks(book);
      });
    },
    [book]
  );

  const removeTask = useCallback(
    (bookid, taskid) => (event) => {
      api.deleteTask(bookid, taskid).then((res) => {
        if (res.status !== 200) return;
        const newTodos = bookTasks.filter((t) => t.id !== taskid);
        setBookTasks(newTodos);
      });
    },
    [bookTasks]
  );

  const removeBook = useCallback(
    (bookid) => (event) => {
      api.deleteBook(bookid).then((res) => {
        if (res.status !== 204) return;
        const newBooks = books.filter((t) => t.id !== bookid);
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
            onClick={removeBook(book.id)}
            className="remove-book"
            icon={faTimesCircle}
          />
        </div>
      </div>

      <div className="books-list">
        {books.length &&
          books.map((b) => (
            <span
              key={b.id}
              onClick={() => setBook(b)}
              className={b.id === book.id ? "book active" : "book"}
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
              key={task.id}
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
                  onClick={removeTask(book.id, task.id)}
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
