export interface PortfolioItem {
    id?: number;
    title: string;
    description?: string;
    category: string;
    image_url: string;
    before_image_url?: string;
    after_image_url?: string;
    is_featured?: boolean;
    created_at?: Date;
}

export class PortfolioOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: { Field: string; Message: string; HasError: boolean };
    Items?: PortfolioItem[];

    constructor(items?: PortfolioItem[], message?: string, error?: { Field: string; Message: string }) {
        this.Items = items;
        this.Message = message;
        this.Error = error ? { ...error, HasError: true } : undefined;
        this.HasError = error ? true : false;
    }
}