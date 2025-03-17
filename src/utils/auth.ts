// Store tokens in local storage
export const setAuthToken = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };
  
  // Retrieve access token
  export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };
  
  // Retrieve refresh token
  export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
  };
  
  // Clear tokens (for logout)
  export const clearAuthTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  