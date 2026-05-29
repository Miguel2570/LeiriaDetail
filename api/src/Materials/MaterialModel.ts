// src/Material/MaterialModel.ts

export interface Material {
    id?: number;
    name: string;
    description?: string;
    category?: string;
    brand?: string;
    purchase_url?: string;
    image_file_id?: string;      // UUID do File
    image_data?: string;          // base64 (preenchido ao carregar)
    image_extension?: string;     // extensão do ficheiro
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