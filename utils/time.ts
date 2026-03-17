import { format, addMinutes, parse } from 'date-fns';

/**
 * Converts "09:30-10:30" (24h) to "09:30 - 10:30 AM" (12h)
 */
export const formatSlotRange = (slot: string): string => {
    if (!slot || !slot.includes('-')) return slot;
    const [start, end] = slot.split('-');

    try {
        const startDate = parse(start.trim(), 'HH:mm', new Date());
        const endDate = parse(end.trim(), 'HH:mm', new Date());

        const startAMPM = format(startDate, 'a');
        const endAMPM = format(endDate, 'a');

        if (startAMPM === endAMPM) {
            return `${format(startDate, 'hh:mm')} - ${format(endDate, 'hh:mm a')}`;
        }
        return `${format(startDate, 'hh:mm a')} - ${format(endDate, 'hh:mm a')}`;
    } catch {
        return slot;
    }
};

/**
 * Generates "07:00 - 07:30 AM" from a "07:00" string or Date object
 */
export const generate30MinSlot = (startTime: string | Date): string => {
    let date: Date;
    if (typeof startTime === 'string') {
        try {
            date = new Date(startTime);
            if (isNaN(date.getTime())) {
                date = parse(startTime, 'HH:mm', new Date());
            }
        } catch {
            return startTime;
        }
    } else {
        date = startTime;
    }

    try {
        const end = addMinutes(date, 30);
        const startAMPM = format(date, 'a');
        const endAMPM = format(end, 'a');
        
        if (startAMPM === endAMPM) {
            return `${format(date, 'hh:mm')} - ${format(end, 'hh:mm a')}`;
        }
        return `${format(date, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
    } catch {
        return typeof startTime === 'string' ? startTime : format(startTime, 'hh:mm a');
    }
};
