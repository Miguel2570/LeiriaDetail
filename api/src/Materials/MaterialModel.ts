export interface Material {
    id?: number;
    name: string;
    description?: string;
    category?: string;
    brand?: string;
    purchase_url?: string;
    image_url?: string;
    order_index?: number;
}

export class MaterialOutputModel {
    HasError: boolean;
    Message?: string;
    Materials?: Material[];
    Categories?: string[];

    constructor(materials?: Material[], categories?: string[], message?: string) {
        this.Materials = materials;
        this.Categories = categories;
        this.Message = message;
        this.HasError = false;
    }
}