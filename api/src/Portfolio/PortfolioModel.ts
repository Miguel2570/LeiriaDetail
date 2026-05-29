// src/Portfolio/PortfolioModel.ts

export interface PortfolioItem {
    id?: number;
    title: string;
    description?: string;
    category: string;
    mainImageFileId?: string;       // UUID do File
    mainImageData?: string;          // base64 (preenchido no frontend)
    beforeImageFileId?: string;
    beforeImageData?: string;
    afterImageFileId?: string;
    afterImageData?: string;
    galleryImages?: PortfolioGalleryImage[];
    is_featured?: boolean;
    created_at?: Date;
}

export interface PortfolioGalleryImage {
    id?: number;
    fileId: string;      // UUID do File
    fileData?: string;   // base64 (preenchido no frontend)
    fileName?: string;
    fileExtension?: string;
    type: string;        // 'gallery', 'before', 'after'
    sortOrder?: number;
    url?: string;        // Data URL completo para mostrar
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