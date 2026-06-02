// api/src/Reviews/ReviewModel.ts

export interface Review {
    id?: number;
    name: string;
    car: string;
    text: string;
    rating?: number;
    is_approved?: boolean;
    created_at?: Date;
    booking_id?: number;
    user_id?: number;
    token?: string;
    submitted?: boolean;
}

export class ReviewOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: { Field: string; Message: string; HasError: boolean };
    Reviews?: Review[];

    constructor(reviews?: Review[], message?: string, error?: { Field: string; Message: string }) {
        this.Reviews = reviews;
        this.Message = message;
        this.Error = error ? { ...error, HasError: true } : undefined;
        this.HasError = error ? true : false;
    }
}