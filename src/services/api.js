import axios from 'axios'

const api = axios.create({
    baseURL: 'https://crowbox-backend.herokuapp.com',
})

export default api