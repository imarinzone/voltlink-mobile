import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api.service';

export interface FamilyVehicle {
    id: string;
    memberName: string;
    vehicleModel: string;
    batteryLevel: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export interface MyVehicle {
    id: string;
    name: string;
    make?: string;
    model: string;
    licensePlate: string;
    batteryLevel: number;
    rangeKm: number;
    status: string;
    lastChargedAt: string;
}

const DEFAULT_USER_ID = process.env.EXPO_PUBLIC_DEFAULT_USER_ID ?? '11';

interface VehicleState {
    myVehicle: MyVehicle;
    currentVehicleId: string | null;
    familyVehicles: FamilyVehicle[];
    addFamilyVehicle: (vehicle: Omit<FamilyVehicle, 'id'>) => void;
    removeFamilyVehicle: (id: string) => void;
    updateMyVehicleBattery: (level: number) => void;
    setCurrentVehicleId: (id: string | null) => void;
    setMyVehicleFromUserData: (v: any) => void;
    fetchMyVehicle: (vehicleId?: string | null) => Promise<void>;
    fetchFamilyVehicles: (userId?: string) => Promise<void>;
    addFamilyMemberApi: (data: { name: string; relation: string }) => Promise<void>;
    removeFamilyMemberApi: (memberId: string | number) => Promise<void>;
}

const EMPTY_VEHICLE: MyVehicle = {
    id: '',
    name: '',
    make: '',
    model: '',
    licensePlate: '',
    batteryLevel: 0,
    rangeKm: 0,
    status: 'Unknown',
    lastChargedAt: '',
};

export const useVehicleStore = create<VehicleState>()(
    persist(
        (set, get) => ({
            myVehicle: EMPTY_VEHICLE,
            currentVehicleId: null,
            familyVehicles: [],
            addFamilyVehicle: (v) => set((state) => ({
                familyVehicles: [...state.familyVehicles, { ...v, id: `fv${Date.now()}` }]
            })),
            removeFamilyVehicle: (id) => set((state) => ({
                familyVehicles: state.familyVehicles.filter((v) => v.id !== id)
            })),
            updateMyVehicleBattery: (level) => set((state) => ({
                myVehicle: { ...state.myVehicle, batteryLevel: level }
            })),
            setCurrentVehicleId: (id) => set({ currentVehicleId: id }),
            setMyVehicleFromUserData: (v: any) => {
                if (!v) { set({ myVehicle: EMPTY_VEHICLE }); return; }
                const soc = v.current_soc ?? 0;
                const capacity = v.battery_capacity_kwh ?? 0;
                const efficiency = v.efficiency_km_per_kwh ?? 0;
                const rangeKm = Math.round((soc / 100) * capacity * efficiency);
                set({
                    currentVehicleId: String(v.id),
                    myVehicle: {
                        id: String(v.id),
                        name: `${v.make || ''} ${v.model || ''}`.trim(),
                        make: v.make || '',
                        model: v.model || '',
                        licensePlate: v.license_plate || '',
                        batteryLevel: soc,
                        rangeKm,
                        status: v.status || 'Unknown',
                        lastChargedAt: v.last_location_update || v.updated_at || '',
                    },
                });
            },
            fetchMyVehicle: async (vehicleId?: string | null) => {
                try {
                    const id = vehicleId !== undefined ? vehicleId : get().currentVehicleId;
                    if (!id) {
                        set({ myVehicle: EMPTY_VEHICLE, currentVehicleId: null });
                        return;
                    }

                    const res = await apiClient.get(`/vehicles/${id}`);
                    const d = res.data.data || res.data;

                    // Estimate range: (SOC% / 100) × battery_capacity_kwh × efficiency_km_per_kwh
                    const soc = d.current_soc ?? 0;
                    const capacity = d.battery_capacity_kwh ?? 0;
                    const efficiency = d.efficiency_km_per_kwh ?? 0;
                    const rangeKm = Math.round((soc / 100) * capacity * efficiency);

                    set({
                        myVehicle: {
                            id: String(d.id),
                            name: `${d.make || ''} ${d.model || ''}`.trim(),
                            make: d.make || '',
                            model: d.model || '',
                            licensePlate: d.license_plate || '',
                            batteryLevel: soc,
                            rangeKm,
                            status: d.status || 'Unknown',
                            lastChargedAt: d.last_location_update || d.updated_at || '',
                        },
                    });
                } catch (error) {
                    console.error('Error fetching vehicle data:', error);
                    set({ myVehicle: EMPTY_VEHICLE });
                }
            },
            fetchFamilyVehicles: async (userId?: string) => {
                try {
                    const id = userId || DEFAULT_USER_ID;
                    const res = await apiClient.get(`/users/${id}/family`);
                    const data = res.data || [];
                    set({
                        familyVehicles: data.map((m: any) => ({
                            id: String(m.id),
                            memberName: m.name,
                            vehicleModel: m.vehicle_model,
                            batteryLevel: m.battery_level,
                            coordinates: m.coordinates
                        }))
                    });
                } catch (error) {
                    console.error('Error fetching family:', error);
                    set({ familyVehicles: [] });
                }
            },
            addFamilyMemberApi: async (data) => {
                try {
                    const id = DEFAULT_USER_ID;
                    await apiClient.post(`/users/${id}/family`, data);
                    await get().fetchFamilyVehicles(id);
                } catch (error) {
                    console.error('Error adding family member:', error);
                    throw error;
                }
            },
            removeFamilyMemberApi: async (memberId) => {
                try {
                    const id = DEFAULT_USER_ID;
                    await apiClient.delete(`/users/${id}/family/${memberId}`);
                    await get().fetchFamilyVehicles(id);
                } catch (error) {
                    console.error('Error removing family member:', error);
                }
            }
        }),
        {
            name: 'vehicle-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
