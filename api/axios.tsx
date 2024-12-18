import axios from 'axios';

const instance = axios.create({
//   baseURL: 'https://booksmart-backend-rcxk.onrender.com',
  // baseURL : 'https://scarcely-funky-gnu.ngrok-free.app',
  // baseURL: 'http://95.216.240.153:5000',
  // baseURL: 'http://192.168.142.135:5000',
  headers: {
    'Content-Type': 'application/json'
  },
})

export default instance;