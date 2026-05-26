export interface Service {
    id?: number;
    name: string;
    description?: string;
    price_ab: number;
    price_c: number;
    price_de: number;
    duration_minutes?: number;
    pack_type?: string;
}

export class ErrorField {
    Field: string;
    Message: string;
    HasError: boolean;

    constructor(field: string, message: string) {
        this.Field = field;
        this.Message = message;
        this.HasError = true;
    }
}

export class ServiceOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: ErrorField;
    Services?: Service[];

    constructor(services?: Service[], message?: string, error?: { Field: string; Message: string }) {
        this.Services = services;
        this.Message = message;
        this.Error = error ? new ErrorField(error.Field, error.Message) : undefined;
        this.HasError = error ? true : false;
    }
}