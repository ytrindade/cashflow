const AUTH_TOKEN_KEY = 'cf_auth_token';
const AUTH_NAME_KEY = 'cf_auth_name';

let authToken = null;
let authName = '';

const canUseSessionStorage = () => typeof window !== 'undefined' && !!window.sessionStorage;

const loadFromSessionStorage = () => {
  if (!canUseSessionStorage()) {
    return;
  }

  if (!authToken) {
    authToken = window.sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  if (!authName) {
    authName = window.sessionStorage.getItem(AUTH_NAME_KEY) || '';
  }
};

export const setAuthSession = ({ token, name }) => {
  authToken = token || null;
  authName = name || '';

  if (!canUseSessionStorage()) {
    return;
  }

  if (authToken) {
    window.sessionStorage.setItem(AUTH_TOKEN_KEY, authToken);
  } else {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }

  if (authName) {
    window.sessionStorage.setItem(AUTH_NAME_KEY, authName);
  } else {
    window.sessionStorage.removeItem(AUTH_NAME_KEY);
  }
};

export const clearAuthSession = () => {
  authToken = null;
  authName = '';

  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_NAME_KEY);
};

export const updateAuthName = (name) => {
  authName = name || '';

  if (!canUseSessionStorage()) {
    return;
  }

  if (authName) {
    window.sessionStorage.setItem(AUTH_NAME_KEY, authName);
    return;
  }

  window.sessionStorage.removeItem(AUTH_NAME_KEY);
};

export const getAuthToken = () => {
  if (!authToken) {
    loadFromSessionStorage();
  }

  return authToken;
};

export const getAuthName = () => {
  if (!authName) {
    loadFromSessionStorage();
  }

  return authName;
};

export const isAuthenticated = () => !!getAuthToken();