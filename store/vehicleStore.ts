import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FamilyVehicle {
    id: string;
    memberName: string;
    vehicleModel: string;
    batteryLevel: number;
}

export interface MyVehicle {
    id: string;
    name: string;
    model: string;
    licensePlate: string;
    batteryLevel: number;
    rangeKm: number;
    status: string;
    lastChargedAt: string;
}

interface VehicleState {
    myVehicle: MyVehicle;
    familyVehicles: FamilyVehicle[];
    addFamilyVehicle: (vehicle: Omit<FamilyVehicle, 'id'>) => void;
    removeFamilyVehicle: (id: string) => void;
    updateMyVehicleBattery: (level: number) => void;
}

const INITIAL_MY_VEHICLE: MyVehicle = {
    id: 'bv1',
    name: 'Tata Nexon EV',
    model: 'Nexon EV Max',
    licensePlate: 'DL 5C AB 1234',
    batteryLevel: 54,
    rangeKm: 135,
    status: 'Idle',
    lastChargedAt: new Date(Date.now() - 7200000).toISOString(),
};

const INITIAL_FAMILY: FamilyVehicle[] = [
    { id: 'fv1', memberName: 'Rohan', vehicleModel: 'Nexon EV', batteryLevel: 72 },
    { id: 'fv2', memberName: 'Ananya', vehicleModel: 'MG ZS EV', batteryLevel: 31 },
    { id: 'fv3', memberName: 'Mom', vehicleModel: 'Tiago EV', batteryLevel: 88 },
];

export const useVehicleStore = create<VehicleState>()(
    persist(
        (set) => ({
            myVehicle: INITIAL_MY_VEHICLE,
            familyVehicles: INITIAL_FAMILY,
            addFamilyVehicle: (v) => set((state) => ({
                familyVehicles: [...state.familyVehicles, { ...v, id: `fv${Date.now()}` }]
            })),
            removeFamilyVehicle: (id) => set((state) => ({
                familyVehicles: state.familyVehicles.filter((v) => v.id !== id)
            })),
            updateMyVehicleBattery: (level) => set((state) => ({
                myVehicle: { ...state.myVehicle, batteryLevel: level }
            })),
        }),
        {
            name: 'vehicle-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
