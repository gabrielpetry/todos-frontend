import React, { useEffect } from "react";
import TodoList from "./components/TodoList";
import api from "./services/todoApi";

export default () => {
  useEffect(() => {
    const userToken = async () => {
      if (localStorage.getItem("token")) return;
      const username = prompt("Your username please");
      const pass = prompt("your password, not encrypt, duh!");
      // const pass = "123abc1";
      // const username = "gabrielpetry";
      const token = await api.getToken(username, pass);
      localStorage.setItem("token", token.data.token);
    };

    userToken();
  }, []);
  return (
    <div className="App">
      <TodoList></TodoList>
    </div>
  );
};
