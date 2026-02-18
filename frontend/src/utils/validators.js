import { normalizeEmail } from './formatters';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email = '') => emailRegex.test(normalizeEmail(email));

export const isNonEmpty = (value = '') => value.trim().length > 0;
