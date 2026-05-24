export interface Faq {
    id?: number;
    question: string;
    answer: string;
    order_index?: number;
    is_active?: boolean;
}

export class FaqOutputModel {
    HasError: boolean;
    Message?: string;
    Faqs?: Faq[];

    constructor(faqs?: Faq[], message?: string) {
        this.Faqs = faqs;
        this.Message = message;
        this.HasError = false;
    }
}