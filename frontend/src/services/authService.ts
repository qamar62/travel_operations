import { api } from './api';
import { setAuthToken, setRefreshToken, removeAuthTokens } from '../utils/auth';

interface LoginCredentials {
    username: string;
    password: string;
}

interface AuthResponse {
    access: string;
    refresh: string;
}

export const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
        const response = await api.post<AuthResponse>('/users/login/', credentials);
        const { access, refresh } = response.data;
        setAuthToken(access);
        setRefreshToken(refresh);
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const logout = (): void => {
    removeAuthTokens();
};

export const refreshAccessToken = async (): Promise<void> => {
    try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) {
            throw new Error('No refresh token available');
        }
        
        const response = await api.post<{ access: string }>('/users/token/refresh/', {
            refresh
        });
        
        setAuthToken(response.data.access);
    } catch (error) {
        console.error('Token refresh failed:', error);
        removeAuthTokens();
        throw new Error('Token refresh failed');
    }
};
