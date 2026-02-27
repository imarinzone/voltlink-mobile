import { USE_MOCK } from '../utils/mock-flag';
import { mockDriverData } from '../mock/driver.mock';
import { apiClient } from './api.service';

export const getVehicleDashboard = async (vehicleId: string) => {
    if (USE_MOCK) {
        const vehicle = mockDriverData.vehicles.find(v => v.id === vehicleId) || mockDriverData.vehicles[0];
        return Promise.resolve(vehicle);
    }
    return apiClient.get(`/driver/vehicles/${vehicleId}`).then(res => res.data);
};

export const getTodayStats = async () => {
    if (USE_MOCK) {
        return Promise.resolve(mockDriverData.todayStats);
    }
    return apiClient.get('/driver/stats/today').then(res => res.data);
};

export const getNotifications = async () => {
    if (USE_MOCK) {
        return Promise.resolve(mockDriverData.notifications);
    }
    return apiClient.get('/driver/notifications').then(res => res.data);
};
