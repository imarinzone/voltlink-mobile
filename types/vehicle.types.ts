export type VehicleStatus = 'Idle' | 'Charging' | 'Needs Charge';

export interface Vehicle {
    id: string;
    name: string;
    model: string;
    licensePlate: string;
    batteryLevel: number;
    rangeKm: number;
    status: VehicleStatus;
    lastChargedAt: string;
}

export interface TodayStats {
    distanceKm: number;
    kwhConsumed: number;
    costPerKwh: number;
}
