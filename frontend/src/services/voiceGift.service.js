import { api, apiUpload } from './api';

export const create = (formData) => apiUpload.post('/v1/voice-gifts', formData);

export const get = (id) => api.get(`/v1/voice-gifts/${id}`);
