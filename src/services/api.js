import axios from 'axios';

const pokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const backendApi = axios.create({
  baseURL: 'http://localhost:3000', // Asegúrate de que este es el puerto correcto de tu backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores
const addErrorInterceptor = (apiInstance) => {
  apiInstance.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );
};

addErrorInterceptor(pokeApi);
addErrorInterceptor(backendApi);

export { pokeApi, backendApi };