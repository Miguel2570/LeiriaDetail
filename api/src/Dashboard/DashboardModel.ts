// src/Dashboard/DashboardModel.ts

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

export class DashboardOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Metrics?: any;
    Revenue?: any[];
    ActivityLogs?: any[];

    constructor(Metrics?: any, Revenue?: any[], ActivityLogs?: any[], Error?: ErrorModel) {
        this.Metrics = Metrics;
        this.Revenue = Revenue;
        this.ActivityLogs = ActivityLogs;
        this.Error = Error;
        this.HasError = (Error != undefined);
    }
}