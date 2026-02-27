import { Vehicle, TodayStats } from '../types/vehicle.types';

export const mockDriverData = {
    vehicles: [
        {
            id: 'v1',
            name: 'Tata Nexon EV',
            model: 'Nexon EV',
            licensePlate: 'KA 01 MG 1234',
            batteryLevel: 18,
            rangeKm: 42,
            status: 'Needs Charge',
            lastChargedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 'v2',
            name: 'Mahindra Treo',
            model: 'Treo',
            licensePlate: 'KA 03 EF 5678',
            batteryLevel: 85,
            rangeKm: 110,
            status: 'Idle',
            lastChargedAt: new Date(Date.now() - 3600000).toISOString(),
        }
    ] as Vehicle[],

    todayStats: {
        distanceKm: 142.5,
        kwhConsumed: 22.4,
        costPerKwh: 12.5,
    } as TodayStats,

    notifications: [
        {
            id: 'n1',
            type: 'low_battery',
            title: 'Low Battery Alert',
            message: 'Your battery is below 20%. Consider charging at the nearest station.',
            timestamp: new Date(),
            read: false,
        },
        {
            id: 'n2',
            type: 'recommendation',
            title: 'Optimal Charging Station',
            message: 'BESCOM Fast Charger is 2km away with zero wait time.',
            timestamp: new Date(Date.now() - 600000),
            read: false,
        }
    ]
};
