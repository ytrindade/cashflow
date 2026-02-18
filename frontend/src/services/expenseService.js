import api from './api';
import { EXPENSES_URL } from '../constants/apiUrls';

export const getExpenses = () => api.get(EXPENSES_URL);

export const getExpenseById = (id) =>
  api.get(`${EXPENSES_URL}/${id}`);

export const createExpense = (payload) =>
  api.post(EXPENSES_URL, payload);

export const updateExpense = (id, payload) =>
  api.put(`${EXPENSES_URL}/${id}`, payload);

export const deleteExpense = (id) =>
  api.delete(`${EXPENSES_URL}/${id}`);
