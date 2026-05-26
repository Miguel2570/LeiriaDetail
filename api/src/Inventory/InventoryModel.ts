// src/Inventory/InventoryModel.ts

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

export interface Product {
    id: number;
    name: string;
    category: string;
    stock_quantity: number;
    min_stock: number;
    unit: string;
    supplier: string;
    last_ordered: string;
    is_active: boolean;
}

export class InventoryOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Products?: Product[];
    Product?: Product;
    Message?: string;

    constructor(Products?: Product[], Product?: Product, Message?: string, Error?: ErrorModel) {
        this.Products = Products;
        this.Product = Product;
        this.Message = Message;
        this.Error = Error;
        this.HasError = (Error != undefined);
    }
}