import { apiClient, fetchWithCache } from './api.service';

const DEFAULT_FLEET_ID = process.env.EXPO_PUBLIC_DEFAULT_FLEET_ID ?? '1';
const DEFAULT_DRIVER_ID = process.env.EXPO_PUBLIC_DEFAULT_DRIVER_ID ?? '4';

export const getDriverProfile = async (driverId: string = DEFAULT_DRIVER_ID, forceRefresh?: boolean) =>
    fetchWithCache(`/users/${driverId}`, { forceRefresh });

export const getVehiclesByDriver = async (driverId: string = DEFAULT_DRIVER_ID, forceRefresh?: boolean) =>
    fetchWithCache(`/users/${driverId}`, { forceRefresh }).then(data => {
        // New API: vehicle is a single embedded object, not an array
        const v = data?.vehicle;
        return v ? [v] : [];
    });

export const getVehicleDashboard = async (vehicleId: string, forceRefresh?: boolean) =>
    fetchWithCache(`/vehicles/${vehicleId}`, { forceRefresh }).then(data => {
        const d = data.data || data;
        const soc = d.current_soc ?? 0;
        const capacity = d.battery_capacity_kwh ?? 0;
        const efficiency = d.efficiency_km_per_kwh ?? 0;
        const rangeKm = Math.round((soc / 100) * capacity * efficiency);
        return {
            id: String(d.id),
            name: `${d.make || ''} ${d.model || ''}`.trim(),
            make: d.make || '',
            model: d.model || '',
            licensePlate: d.license_plate || '',
            batteryLevel: soc,
            rangeKm,
            status: d.status as any,
            lastChargedAt: d.last_location_update || d.updated_at || 'Unknown',
            driverName: '',   // driver name comes from getDriverProfile
            driverEmail: '',
        };
    });

export const getTodayStats = async (vehicleId: string, forceRefresh?: boolean) =>
    fetchWithCache(`/vehicles/${vehicleId}`, { forceRefresh }).then(data => {
        const d = data.data || data;
        const soc = d.current_soc ?? 0;
        const capacity = d.battery_capacity_kwh ?? 0;
        return {
            distanceKm: 0,
            kwhConsumed: Math.round((capacity * soc / 100) * 10) / 10,
            costPerKwh: 12.0,
        };
    });

export const getDriverSessions = async (
    fleetId: string = DEFAULT_FLEET_ID,
    vehicleId: string,
    status?: string,
    forceRefresh?: boolean
) =>
    fetchWithCache(`/fleets/${fleetId}/sessions`, {
        params: { vehicle_id: vehicleId, status }, forceRefresh
    }).then(data => data?.data || []);

