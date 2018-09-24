export const getRefreshToken = () => JSON.parse(localStorage.getItem('token') || '{}').refresh_token;
