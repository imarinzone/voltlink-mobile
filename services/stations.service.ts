import { apiClient, fetchWithCache } from './api.service';
import { Station } from '../types/station.types';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
};

// Default user location from env (fallback: Bangalore)
const USER_LAT = parseFloat(process.env.EXPO_PUBLIC_DEFAULT_LAT ?? '12.9716');
const USER_LNG = parseFloat(process.env.EXPO_PUBLIC_DEFAULT_LNG ?? '77.5946');

const BANGALORE_BOUNDS = {
    latMin: 12.75, latMax: 13.15,
    lngMin: 77.35, lngMax: 77.85,
};

const isInBangalore = (lat?: number, lng?: number): boolean => {
    if (lat == null || lng == null) return false;
    return lat >= BANGALORE_BOUNDS.latMin && lat <= BANGALORE_BOUNDS.latMax &&
           lng >= BANGALORE_BOUNDS.lngMin && lng <= BANGALORE_BOUNDS.lngMax;
};

export const getStations = async (params?: any, forceRefresh?: boolean): Promise<Station[]> =>
    fetchWithCache('/charging-stations', { params, forceRefresh }).then(data => {
        const stations = data.data || [];
        return stations
            .filter((s: any) => isInBangalore(s.latitude, s.longitude))
            .map((s: any) => {
                const dist = s.latitude && s.longitude
                    ? calculateDistance(USER_LAT, USER_LNG, s.latitude, s.longitude)
                    : 5.2;
                return {
                    ...s,
                    id: s.id.toString(),
                    cpoName: s.operator_id || 'VoltLink Partner',
                    chargerTypes: s.charging_types || [],
                    availableChargers: s.available_chargers || 0,
                    totalChargers: s.total_chargers || 0,
                    distanceKm: dist,
                    etaMinutes: Math.round(dist * 2.5),
                    pricePerKwh: s.price_per_kwh || 0,
                    coordinates: { latitude: s.latitude, longitude: s.longitude },
                };
            });
    });

export const getStationById = async (id: string, forceRefresh?: boolean): Promise<Station> =>
    fetchWithCache(`/charging-stations/${id}`, { forceRefresh }).then(data => {
        const d = data;
        const dist = d.latitude && d.longitude
            ? calculateDistance(USER_LAT, USER_LNG, d.latitude, d.longitude)
            : 5.2;
        return {
            ...d,
            id: d.id.toString(),
            name: d.station_name || d.name || 'Charging Station',
            cpoName: d.operator_id || 'VoltLink Partner',
            chargerTypes: [],
            distanceKm: dist,
            etaMinutes: Math.round(dist * 2.5),
            coordinates: { latitude: d.latitude, longitude: d.longitude },
        };
    });

export const getAIRecommendations = async (
    vehicleId: string,
    forceRefresh?: boolean
): Promise<Station[]> =>
    fetchWithCache(`/vehicles/${vehicleId}/recommendations`, { forceRefresh }).then(data => {
        const d = data || [];
        return d.map((s: any) => {
            const lat = s.evse?.latitude || s.latitude || USER_LAT;
            const lng = s.evse?.longitude || s.longitude || USER_LNG;
            const dist = calculateDistance(USER_LAT, USER_LNG, lat, lng);
            const rate = (s.predicted_cost && s.predicted_kwh) 
                ? parseFloat((s.predicted_cost / s.predicted_kwh).toFixed(2)) 
                : (s.price_per_kwh || 0);

            return {
                ...s,
                id: s.id || String(s.station_id || '').replace(/^STN/i, '') || s.id?.toString(),
                name: s.station_name || s.name || 'AI Suggested Station',
                cpoName: s.operator_id || 'VoltLink Optimized',
                chargerTypes: s.charging_types || [],
                availableChargers: s.available_chargers ?? 1,
                totalChargers: s.total_chargers ?? 4,
                pricePerKwh: s.price_per_kwh || rate,
                effectivePrice: rate,
                aiReason: s.reason_summary || s.ai_reason || 'Highly recommended for your route',
                distanceKm: dist,
                etaMinutes: Math.round(dist * 2.5),
                nextAvailableMinutes: s.predicted_wait_time || 0,
                predictedRevenueLoss: s.predicted_revenue_loss || 0,
                predictedWaitTime: s.predicted_wait_time || 0,
                predictedKwh: s.predicted_kwh || 0,
                predictedCost: s.predicted_cost || 0,
                station_id: s.station_id,
                coordinates: { latitude: lat, longitude: lng },
            };
        });
    });
