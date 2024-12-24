export const getAuthToken = (): string | null => {
    const token = localStorage.getItem('access_token');
    return token ? `Bearer ${token}` : null;
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem('access_token', token);
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem('refresh_token', token);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token');
};

export const removeAuthTokens = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

// For development/testing purposes
// Remove this in production
export const setTestToken = (): void => {
    // Set a test token for development
    setAuthToken('your-test-token-here');
};
