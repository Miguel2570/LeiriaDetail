// src/Appointments/AppointmentModel.ts

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

export interface Booking {
    id: number;
    clientName: string;
    clientPhone: string;
    service: string;
    vehicle: string;
    vehiclePlate: string;
    date: string;
    time: string;
    duration: string;
    status: string;
    bay: string | null;
}

export interface Bay {
    id: string;
    name: string;
    bookings: Booking[];
}

export interface AppointmentsData {
    pending: Booking[];
    bays: Bay[];
}

export class AppointmentOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Data?: AppointmentsData;

    constructor(Data?: AppointmentsData, Error?: ErrorModel) {
        this.Data = Data;
        this.Error = Error;
        this.HasError = (Error != undefined);
    }
}