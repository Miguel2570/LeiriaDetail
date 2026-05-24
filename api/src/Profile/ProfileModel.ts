// api/src/Profile/ProfileModel.ts

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

export interface IUserProfile {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ProfileOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: ErrorModel;
    Profile?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    };

    constructor(profile?: any, message?: string, error?: ErrorModel) {
        if (profile) {
            this.Profile = {
                id: profile.id,
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: profile.email,
                phone: profile.phone || '',
                isVerified: profile.is_verified,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at
            };
        }
        this.Message = message;
        this.Error = error;
        this.HasError = error ? error.HasError : false;
    }
}

export class UpdateProfileOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: ErrorModel;
    firstName?: string;
    lastName?: string;
    phone?: string;

    constructor(firstName?: string, lastName?: string, phone?: string, message?: string, error?: ErrorModel) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.Message = message;
        this.Error = error;
        this.HasError = (error != undefined && error.HasError);
    }
}

export class UpdatePasswordOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: ErrorModel;

    constructor(message?: string, error?: ErrorModel) {
        this.Message = message;
        this.Error = error;
        this.HasError = (error != undefined && error.HasError);
    }
}