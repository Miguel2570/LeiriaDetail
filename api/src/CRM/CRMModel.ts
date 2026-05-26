// src/CRM/CRMModel.ts

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

export interface Vehicle {
    id: number;
    plate: string;
    model: string;
    brand: string;
    year: number;
    color: string;
    size_category: string;
}

export interface HistoryRecord {
    id: number;
    vehicleId: number;
    date: string;
    service: string;
    status: string;
    price: number;
}

export interface Client {
    id: number;
    name: string;
    phone: string;
    email: string;
    ltv: string;
    avatar: string;
    vehicles: Vehicle[];
    history: HistoryRecord[];
}

export class CRMOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Clients?: Client[];
    Client?: Client | null;

    constructor(Clients?: Client[], Client?: Client | null, Error?: ErrorModel) {
        this.Clients = Clients;
        this.Client = Client;
        this.Error = Error;
        this.HasError = (Error != undefined);
    }
}