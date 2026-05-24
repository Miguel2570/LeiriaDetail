export interface User {
    id?: number;
    first_name?: string;
    last_name?: string;
    phone?: string;
    email: string;
    password_hash?: string;
    is_verified?: boolean;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    last_login_at?: Date;
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

export class LoginOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    CredencialKey?: number;
    SessionKey?: string;

    constructor(SessionKey?: string, CredencialKey?: number, Error?: ErrorModel) {
        this.SessionKey = SessionKey;
        this.CredencialKey = CredencialKey;
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class CreateUserOutputModel {
    HasError: boolean;
    Message?: string;
    EmailSent?: boolean;
    Error?: ErrorModel;

    constructor(Message?: string, EmailSent?: boolean, Error?: ErrorModel) {
        this.Message = Message;
        this.EmailSent = EmailSent;
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class ResendVerificationOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: ErrorModel;

    constructor(Message?: string, Error?: ErrorModel) {
        this.Message = Message;
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class ResetPasswordOutputModel {
    HasError: boolean;
    Error?: ErrorModel;

    constructor(Error?: ErrorModel) {
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class ChangePasswordOutputModel {
    HasError: boolean;
    Error?: ErrorModel;

    constructor(Error?: ErrorModel) {
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class ValidateTokenOutputModel {
    isValid: boolean;
    message?: string;

    constructor(isValid: boolean, message?: string) {
        this.isValid = isValid;
        this.message = message;
    }
}

export class CheckEmailOutputModel {
    exists: boolean;
    message?: string;

    constructor(exists: boolean, message?: string) {
        this.exists = exists;
        this.message = message;
    }
}