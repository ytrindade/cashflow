import api from './api';
import { USER_URL } from '../constants/apiUrls';

export const createUser = (payload) => api.post(USER_URL, payload);

export const getUserProfile = () => api.get(USER_URL);

export const updateUserProfile = (payload) =>
  api.put(USER_URL, payload);

export const changeUserPassword = (payload) =>
  api.put(`${USER_URL}/change-password`, payload);

export const deleteUserAccount = () =>
  api.delete(`${USER_URL}/`);
