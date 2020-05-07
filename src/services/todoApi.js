import axios from 'axios'

const endpoint = "http://localhost:3000/"

const api = axios.create({
    baseURL: endpoint
})


export default api
