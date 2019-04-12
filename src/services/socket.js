import socket from 'socket.io-client'

const io = socket('https://crowbox-backend.herokuapp.com')

export default io