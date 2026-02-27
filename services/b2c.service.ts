import { mockB2CData } from '../mock/b2c.mock';
import { apiClient } from './api.service';
import { USE_MOCK } from '../utils/mock-flag';

/**
 * Fetches B2C user statistics (credits, carbon saved, etc.)
 */
export const getB2CStats = async () => {
    if (USE_MOCK) {
        return Promise.resolve(mockB2CData.stats);
    }
    return apiClient.get('/b2c/stats').then(res => res.data);
};

/**
 * Fetches B2C credit transactions
 */
export const getCreditTransactions = async () => {
    if (USE_MOCK) {
        return Promise.resolve(mockB2CData.transactions);
    }
    return apiClient.get('/b2c/transactions').then(res => res.data);
};

/**
 * Fetches AI recommendations for B2C users
 */
export const getB2CRecommendations = async () => {
    if (USE_MOCK) {
        return Promise.resolve(mockB2CData.recommendations);
    }
    return apiClient.get('/b2c/recommendations').then(res => res.data);
};
