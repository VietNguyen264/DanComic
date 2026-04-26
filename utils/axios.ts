import axios from 'axios';
 
const axiosInstance = axios.create({
  baseURL: 'https://69d6fefd9c5ebb0918c6e261.mockapi.io',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
export default axiosInstance;
