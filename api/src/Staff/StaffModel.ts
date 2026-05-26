// src/Staff/StaffModel.ts

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

export interface Staff {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    tasks: number;
    created_at: string;
}

export class StaffOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Staff?: Staff[];
    Message?: string;

    constructor(Staff?: Staff[], Message?: string, Error?: ErrorModel) {
        this.Staff = Staff;
        this.Message = Message;
        this.Error = Error;
        this.HasError = (Error != undefined);
    }
}