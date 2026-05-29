// src/Helpers/ErrorModel.ts

export class ErrorModel {
    Field?: string;
    Message: string;
    HasError: boolean;
    Code?: string;

    constructor(field: string | undefined, message: string, code?: string) {
        this.Field = field;
        this.Message = message;
        this.HasError = true;
        this.Code = code;
    }
}

export interface IAudit {
    AuthenticatedUser?: string;
    SessionKey?: string;
    IpAddress?: string;
}