// api/src/Settings/SettingsModel.ts

export interface ISettings {
    iva_enabled: boolean;
    iva_rate: number;
    require_nif: boolean;
    company_name: string;
    company_address: string;
}

export class SettingsOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: { Field: string; Message: string; HasError: boolean };
    Settings?: ISettings;

    constructor(settings?: ISettings, message?: string, error?: { Field: string; Message: string }) {
        this.Settings = settings;
        this.Message = message;
        this.Error = error ? { ...error, HasError: true } : undefined;
        this.HasError = error ? true : false;
    }
}