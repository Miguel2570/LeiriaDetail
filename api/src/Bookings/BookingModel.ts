export interface Booking {
    id?: number;
    user_id: number;
    vehicle_id: number;
    service_id: number;
    booking_date: string;
    booking_time: string;
    status?: string;
    created_at?: Date;
}

export class ErrorModel {
    Field?: string;
    Message: string;
    HasError: boolean;

    constructor(field: string | undefined, message: string) {
        this.Field = field;
        this.Message = message;
        this.HasError = true;
    }
}

export class BookingOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: ErrorModel;
    Booking?: any;

    constructor(booking?: any, message?: string, error?: ErrorModel) {
        this.Booking = booking;
        this.Message = message;
        this.Error = error;
        this.HasError = error ? error.HasError : false;
    }
}

export class SlotsOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Date?: string;
    AvailableSlots?: string[];
    OccupiedSlots?: string[];

    constructor(date?: string, available?: string[], occupied?: string[], error?: ErrorModel) {
        this.Date = date;
        this.AvailableSlots = available;
        this.OccupiedSlots = occupied;
        this.Error = error;
        this.HasError = error ? error.HasError : false;
    }
}

export class PriceOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    VehicleCategory?: string;
    ServiceName?: string;
    Price?: number;
    DurationMinutes?: number;

    constructor(category?: string, name?: string, price?: number, duration?: number, error?: ErrorModel) {
        this.VehicleCategory = category;
        this.ServiceName = name;
        this.Price = price;
        this.DurationMinutes = duration;
        this.Error = error;
        this.HasError = error ? error.HasError : false;
    }
}