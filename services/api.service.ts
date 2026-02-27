import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Dynamically determine the backend base URL.
 * In Expo Go, uses the debugger host IP so the phone can reach the dev machine.
 */
function getBaseUrl(): string {
    // Try to get the dev machine IP from Expo's debugger host
    const debuggerHost =
        Constants.expoConfig?.hostUri ??
        (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

    if (debuggerHost) {
        const ip = debuggerHost.split(':')[0];
        return `http://${ip}:3001/api/v1`;
    }

    // Fallback for emulators
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:3001/api/v1';
    }

    return 'http://localhost:3001/api/v1';
}

const API_URL = getBaseUrl();

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle redirect to login or role selector
        }
        console.warn(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.message);
        return Promise.reject(error);
    }
);
