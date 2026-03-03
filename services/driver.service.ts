import { apiClient } from './api.service';

export const getVehicleDashboard = async (vehicleId: string) => {
    return apiClient.get(`/vehicles/${vehicleId}/extended`).then(res => {
        const d = res.data.data;
        return {
            id: d.id,
            name: d.name || 'My EV',
            model: d.type || 'Nexon EV',
            licensePlate: 'KA 01 EV 1234',
            batteryLevel: d.battery?.percentage || 0,
            rangeKm: d.range?.estimated || 0,
            status: d.status as any,
            lastChargedAt: d.battery?.last_charged || 'Unknown',
            driverName: d.driver?.name || 'Driver',
            driverEmail: d.driver?.email || 'driver@voltlink.com'
        };
    });
};

export const getTodayStats = async (vehicleId: string) => {
    return apiClient.get(`/vehicles/${vehicleId}/extended`).then(res => {
        const d = res.data.data;
        return {
            distanceKm: 0, // Not available in backend model yet
            kwhConsumed: Math.round((d.battery?.capacity_kwh || 0) * (d.battery?.percentage || 0) / 100 * 10) / 10,
            costPerKwh: 12.0 // Still hardcoded as there is no vehicle-specific cost API
        };
    });
};

export const getNotifications = async (fleetId: string = '1') => {
    return apiClient.get(`/fleets/${fleetId}/alerts`).then(res => res.data);
};
