import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export const fetchQRCodes = async () => {
  const response = await api.get('/qr');
  return response.data;
};

export const createQRCode = async (formData) => {
  const response = await api.post('/qr/create', formData);
  return response.data;
};

export const deleteQRCode = async (id) => {
  const response = await api.delete(`/qr/${id}`);
  return response.data;
};