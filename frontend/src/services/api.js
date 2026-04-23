import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
};

export const leadsApi = {
  getAll:  ()         => api.get('/leads'),
  getOne:  (id)       => api.get(`/leads/${id}`),
  create:  (data)     => api.post('/leads', data),
  update:  (id, data) => api.put(`/leads/${id}`, data),
  remove:  (id)       => api.delete(`/leads/${id}`),
};

export const propertiesApi = {
  getAll:  ()         => api.get('/properties'),
  getOne:  (id)       => api.get(`/properties/${id}`),
  create:  (data)     => api.post('/properties', data),
  update:  (id, data) => api.put(`/properties/${id}`, data),
  remove:  (id)       => api.delete(`/properties/${id}`),
};

export const dealsApi = {
  getAll:  ()         => api.get('/deals'),
  getOne:  (id)       => api.get(`/deals/${id}`),
  create:  (data)     => api.post('/deals', data),
  update:  (id, data) => api.put(`/deals/${id}`, data),
  remove:  (id)       => api.delete(`/deals/${id}`),
};

export default api;
