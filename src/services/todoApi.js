import axios from 'axios'

const endpoint = "http://localhost:9090/"

const api = axios.create({
    baseURL: endpoint
})


export default api