import { Station } from '../types/station.types';

export interface B2CStats {
    totalCredits: number;
    availableCredits: number;
    usedCredits: number;
    carbonSavedKg: number;
    totalSessions: number;
}

export interface CreditTransaction {
    id: string;
    amount: number;
    type: 'earned' | 'used';
    description: string;
    date: string;
}

export interface FamilyMember {
    id: string;
    name: string;
    relation: string;
    phone: string;
}

export interface SustainabilityData {
    greenScore: number;
    carbonSavedKg: number;
    renewablePercent: number;
    carbonRank: number;
}

export const mockB2CData = {
    stats: {
        totalCredits: 1250,
        availableCredits: 450,
        usedCredits: 800,
        carbonSavedKg: 142.5,
        totalSessions: 24,
    },
    transactions: [
        {
            id: 'tx1',
            amount: 50,
            type: 'earned',
            description: 'Session at Cyber City Hub',
            date: '2026-02-22T14:30:00Z',
        },
        {
            id: 'tx2',
            amount: 100,
            type: 'used',
            description: 'Voucher Redemption',
            date: '2026-02-20T10:15:00Z',
        },
        {
            id: 'tx3',
            amount: 25,
            type: 'earned',
            description: 'Referral Bonus',
            date: '2026-02-18T09:00:00Z',
        }
    ] as CreditTransaction[],
    recommendations: [
        {
            id: 's1',
            name: 'DLF Cyber Hub Charging',
            cpoName: 'VoltLink Premium',
            distanceKm: 1.2,
            etaMinutes: 5,
            pricePerKwh: 12,
            effectivePrice: 10,
            chargerTypes: ['CCS2', 'Type 2'],
            availableChargers: 6,
            totalChargers: 10,
            aiReason: 'Eco-friendly choice with lowest cost',
            coordinates: { latitude: 28.495, longitude: 77.088 }
        },
        {
            id: 's2',
            name: 'Galleria Market EV Zone',
            cpoName: 'Fortum',
            distanceKm: 3.5,
            etaMinutes: 10,
            pricePerKwh: 15,
            chargerTypes: ['CCS2'],
            availableChargers: 2,
            totalChargers: 4,
            aiReason: 'Highly rated by users like you',
            coordinates: { latitude: 28.465, longitude: 77.090 }
        }
    ] as Station[],
    familyMembers: [
        { id: 'f1', name: 'Priya', relation: 'Spouse', phone: '9876543210' },
        { id: 'f2', name: 'Arjun', relation: 'Child', phone: '9876543211' }
    ] as FamilyMember[],
    sustainability: {
        greenScore: 842,
        carbonSavedKg: 142.5,
        renewablePercent: 68,
        carbonRank: 124
    } as SustainabilityData
};
