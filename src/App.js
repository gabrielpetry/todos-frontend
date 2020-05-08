import React, { useEffect } from "react";
import TodoList from "./components/TodoList";
import api from "../services/todoApi";

export default () => {
  const userToken = async (username, pass) => {
    return await api.getToken(username, pass).then((res) => res.data.token);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) return;
    const username = prompt("Your username please");
    const pass = prompt("your password, not encrypt, duh!");
    const token = userToken(username, pass);
    localStorage.setItem("token", token);
  }, []);
  return (
    <div className="App">
      <TodoList></TodoList>
    </div>
  );
};
