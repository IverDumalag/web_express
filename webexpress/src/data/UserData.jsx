const USER_KEY = 'userData';

export function setUserData(data) {
  localStorage.setItem(USER_KEY, JSON.stringify(data));
}

export function getUserData() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearUserData() {
  localStorage.removeItem(USER_KEY);
}