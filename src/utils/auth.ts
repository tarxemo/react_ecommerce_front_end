// Store tokens and user in local storage
export const setAuthToken = (accessToken: string, refreshToken: string, user: object) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user)); // Store user data
};

// Retrieve access token
export const getAccessToken = () => localStorage.getItem('accessToken');

// Retrieve refresh token
export const getRefreshToken = () => localStorage.getItem('refreshToken');

// Retrieve user object
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Clear tokens and user (for logout)
export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  return accessToken !== null && accessToken !== '';
};
