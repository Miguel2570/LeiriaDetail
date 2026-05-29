// src/Registos/RegistosModel.ts

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

export interface ServiceEntry {
    id: number;
    clientId: number;
    vehicleId: number;
    vehiclePlate: string;
    serviceType: string;
    status: 'EM_ABERTO' | 'EM_PROGRESSO' | 'CONCLUIDO';
    progress: number;
    entryDate: string;
    startedAt: string | null;
    completedAt: string | null;
    observations: string;
    entryChecks: string[];
    checklistItems: string[];
    serviceNotes: string;
    estimatedValue: number;
    totalValue: number;
}

export interface WorkshopStats {
    emAberto: number;
    emProgresso: number;
    concluidosHoje: number;
    faturacaoHoje: number;
}

export class RegistosOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Services?: ServiceEntry[];
    Service?: ServiceEntry | null;
    Stats?: WorkshopStats | null;
    TotalCount?: number;

    constructor(
        Services?: ServiceEntry[], 
        Service?: ServiceEntry | null, 
        Stats?: WorkshopStats | null,
        Error?: ErrorModel
    ) {
        this.Services = Services;
        this.Service = Service;
        this.Stats = Stats;
        this.Error = Error;
        this.HasError = (Error != undefined);
    }
}