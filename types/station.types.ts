export type StationAvailability = 'Available Now' | 'Busy' | string;
export type ChargerType = 'AC' | 'DC' | 'Swap' | 'CCS2' | 'Type 2' | 'CHAdeMO';

export interface Station {
    id: string;
    name: string;
    cpoName: string;
    distanceKm: number;
    etaMinutes: number;
    pricePerKwh: number;
    effectivePrice?: number;
    chargerTypes: ChargerType[];
    availability: StationAvailability;
    availableChargers?: number;
    totalChargers?: number;
    nextAvailableMinutes?: number;
    aiReason?: string;
    slot?: string;
    partnerDiscount?: number;
    station_id?: string | number;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
