// api/src/PendingBookings/PendingBookingsModel.ts

export interface IPendingBooking {
    id: string;
    user_id: number;
    vehicle_id: number;
    service_id: number;
    booking_date: string;
    booking_time: string;
    service_name?: string;
    vehicle_name?: string;
    vehicle_plate?: string;
    price: number;
    payment_method: string;
    invoice_nif?: string;
    invoice_name?: string;
    invoice_address?: string;
    status: 'pending' | 'paid' | 'expired' | 'cancelled';
    created_at: string;
    expires_at: string;
    paid_at?: string;
}

export interface IPendingBookingInput {
    userId: number;
    vehicleId: number;
    serviceId: number;
    bookingDate: string;
    bookingTime: string;
    serviceName?: string;
    vehicleName?: string;
    vehiclePlate?: string;
    price: number;
    paymentMethod?: string;
    invoiceNIF?: string;
    invoiceName?: string;
    invoiceAddress?: string;
    expiresInMinutes?: number;
}

export class PendingBookingOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: { Field: string; Message: string; HasError: boolean };
    PendingBooking?: IPendingBooking;
    PendingBookings?: IPendingBooking[];

    constructor(
        pendingBooking?: IPendingBooking | IPendingBooking[],
        message?: string,
        error?: { Field: string; Message: string }
    ) {
        if (Array.isArray(pendingBooking)) {
            this.PendingBookings = pendingBooking;
        } else {
            this.PendingBooking = pendingBooking;
        }
        this.Message = message;
        this.Error = error ? { ...error, HasError: true } : undefined;
        this.HasError = error ? true : false;
    }
}

export class SlotCheckOutputModel {
    HasError: boolean;
    Error?: { Message: string; HasError: boolean };
    Blocked?: boolean;
    BlockedSlots?: string[];

    constructor(blocked?: boolean | string[], message?: string, error?: { Message: string }) {
        if (typeof blocked === 'boolean') {
            this.Blocked = blocked;
        } else if (Array.isArray(blocked)) {
            this.BlockedSlots = blocked;
        }
        this.Error = error ? { ...error, HasError: true } : undefined;
        this.HasError = error ? true : false;
    }
}