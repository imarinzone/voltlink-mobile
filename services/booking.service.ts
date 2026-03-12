import { apiClient, fetchWithCache } from './api.service';
import {
    Booking,
    PaginatedResponse,
    CreateBookingRequest,
    UpdateBookingRequest,
    CancelBookingRequest,
} from '../types/booking.types';

const DEFAULT_USER_ID = process.env.EXPO_PUBLIC_DEFAULT_USER_ID ?? '11';

export const getBookings = async (params?: {
    user_id?: string;
    status?: string;
    page?: number;
    page_size?: number;
}, forceRefresh?: boolean): Promise<PaginatedResponse<Booking>> => {
    return fetchWithCache('/bookings', { params, forceRefresh });
};

export const getPendingBookings = async (
    userId: string = DEFAULT_USER_ID,
    forceRefresh?: boolean
): Promise<Booking[]> => {
    const result = await getBookings({ user_id: userId, status: 'pending' }, forceRefresh);
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    return [];
};

export const createBooking = async (
    data: CreateBookingRequest
): Promise<Booking> => {
    return apiClient.post('/bookings', data).then(res => res.data);
};

export const cancelBooking = async (
    id: string,
    data?: CancelBookingRequest
): Promise<void> => {
    return apiClient.post(`/bookings/${id}/cancel`, data).then(res => res.data);
};

export const deleteBooking = async (id: string): Promise<void> => {
    return apiClient.delete(`/bookings/${id}`).then(res => res.data);
};
