import axios from 'axios';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000') + '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

//add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if(error.response?.status === 401){
      const refreshToken = localStorage.getItem('refresh_token');
      if(refreshToken){
        try {
          const { data } = await axios.post(`${API_BASE}/token/refresh/`, {
            refresh: refreshToken,
          });

          localStorage.setItem('access_token', data.access);

          error.config.headers.Authorization = `Bearer ${data.access}`;

          return api.request(error.config);

        } catch {

          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';

        }
      }
    }
    return Promise.reject(error);
  }
);

//auth 
export const authAPI = {
  login: (credentials) =>
    axios.post(`${API_BASE}/token/`, credentials),
};

//questions 
export const questionAPI = {

  list: (params) => api.get('/questions/', { params }),
  get: (id) => api.get(`/questions/${id}/`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/questions/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/questions/', data);
  },
  update: (id, data) => api.patch(`/questions/${id}/`, data),
  delete: (id) => api.delete(`/questions/${id}/`),
  upvote: (id) => api.post(`/questions/${id}/upvote/`),
  downvote: (id) => api.post(`/questions/${id}/downvote/`),

};

//answers
export const answerAPI = {
  list: (questionId) => api.get(`/answers/?question=${questionId}`),
  listByAuthor: (username) => api.get(`/answers/?author=${username}`),
  create: (data) => api.post('/answers/', data),
  upvote: (id) => api.post(`/answers/${id}/upvote/`),
  downvote: (id) => api.post(`/answers/${id}/downvote/`),
  markBest: (id) => api.post(`/answers/${id}/mark_best/`),
};

//categories
export const categoryAPI = {
  list: () => api.get('/categories/'),
};

// Profile
export const profileAPI = {
  get: (username) => api.get(`/profiles/${username}/`),
  me: () => api.get('/profiles/me/'),
  update: (data) => api.put('/profiles/me/', data),
};

export default api;
