import axios from "axios";

// const endpoint = "http://localhost:3000/api/";
const endpoint = "http://aws01.gabrielpetry.com.br:3002/api/";

const api = axios.create({
  baseURL: endpoint,
  headers: {
    authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export default {
  async updateOne(book_id, task) {
    return api.put(`/books/${book_id}/tasks/${task._id}`, {
      description: task.description,
      completed: !task.completed,
    });
  },
  async createBook(book) {
    return api.post("/books", book);
  },
  async createTask(book_id, task) {
    return api.post(`/books/${book_id}/tasks`, task);
  },
  async deleteTask(book_id, task_id) {
    return api.delete(`/books/${book_id}/tasks/${task_id}`);
  },
  async deleteBook(book_id) {
    return api.delete(`books/${book_id}`);
  },
  async getBookTasks(book_id) {
    return api.get(`/books/${book_id}/tasks`);
  },
  async getBooks() {
    return api.get("/books");
  },
  async getToken(username, password) {
    return api.post("/users/auth", { username, password });
  },
};
