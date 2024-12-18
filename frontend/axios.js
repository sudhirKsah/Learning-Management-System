import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.BACKEND_URL,
});

export default axiosInstance;
