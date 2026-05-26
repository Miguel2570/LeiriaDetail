// api/src/Payment/PaymentModel.ts

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

export interface Payment {
    id?: number;
    booking_id: number;
    user_id: number;
    amount: number;
    method: string;
    status: string;
    entity?: string;
    reference?: string;
    mbway_phone?: string;
    invoice_nif?: string;
    invoice_name?: string;
    invoice_address?: string;
    paid_at?: Date;
}

export class PaymentOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Payment?: Payment;
    Message?: string;

    constructor(payment?: Payment, message?: string, error?: ErrorModel) {
        this.Payment = payment;
        this.Message = message;
        this.Error = error;
        this.HasError = error != undefined;
    }
}

export class MultibancoData {
    entity: string;
    reference: string;
    amount: string;
    validUntil: string;

    constructor(entity: string, reference: string, amount: number) {
        this.entity = entity;
        this.reference = reference;
        this.amount = amount.toFixed(2) + '€';
        this.validUntil = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
}