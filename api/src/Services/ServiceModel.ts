export interface Service {
    id?: number;
    name: string;
    description?: string;
    price_ab: number;  // Categoria A/B (pequeno/médio)
    price_c: number;   // Categoria C (grande)
    price_de: number;  // Categoria D/E (SUV/comercial)
    duration_minutes?: number;
}

export class ServiceOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: { Field: string; Message: string; HasError: boolean };
    Services?: Service[];

    constructor(services?: Service[], message?: string, error?: { Field: string; Message: string }) {
        this.Services = services;
        this.Message = message;
        this.Error = error ? { ...error, HasError: true } : undefined;
        this.HasError = error ? true : false;
    }
}