// Store tokens and user in local storage
export const setAuthToken = (data:any) => {
  //data.login.accessToken, data.login.refreshToken, data.login.user, data.login.cart, data.login.wishlist
  localStorage.setItem('accessToken', data.login.accessToken);
  localStorage.setItem('refreshToken',  data.login.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.login.user)); // Store user data
  localStorage.setItem('cart',  data.login.cart);
  localStorage.setItem('wishlist',  data.login.wishlist);
  localStorage.setItem('profile',  data.login.user.profilePicture);
};

// Retrieve access token
export const getAccessToken = () => localStorage.getItem('accessToken');

export const getCart = () => localStorage.getItem('cart');
export const getWishlist = () => localStorage.getItem('wishlist');

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
