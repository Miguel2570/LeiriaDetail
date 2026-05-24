export interface Vehicle {
    id?: number;
    user_id: number;
    license_plate: string;
    brand: string;
    model: string;
    year?: number;
    fuel_type?: string;
    size_category?: string;
    vin?: string;
    is_primary?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export class VehicleOutputModel {
    HasError: boolean;
    Error?: { Field: string; Message: string; HasError: boolean };
    Vehicle?: Vehicle;
    Vehicles?: Vehicle[];

    constructor(vehicle?: Vehicle, vehicles?: Vehicle[], error?: { Field: string; Message: string }) {
        this.Vehicle = vehicle;
        this.Vehicles = vehicles;
        this.HasError = error ? true : false;
        this.Error = error ? { ...error, HasError: true } : undefined;
    }
}