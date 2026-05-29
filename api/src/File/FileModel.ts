// src/File/FileModel.ts
import { ErrorModel } from "../Helpers/ErrorModel";

export interface IFile {
    Id: string;
    FileName: string;
    FileExtension: string;
    FileSize: number;
    FileData: string;
    RelatedEntityType?: string;
    RelatedEntityId?: number;
    Tags?: string[];
}

export class GetAllFilesOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Files?: IFile[];

    constructor(Files?: IFile[], Error?: ErrorModel) {
        this.Files = Files;
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class GetFileByIdOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    File?: IFile;

    constructor(File?: IFile, Error?: ErrorModel) {
        this.File = File;
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class CreateFileOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    File?: IFile;

    constructor(File?: IFile, Error?: ErrorModel) {
        this.File = File;
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class UpdateFileOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    File?: IFile;

    constructor(File?: IFile, Error?: ErrorModel) {
        this.File = File;
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}

export class DeleteFileOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    isSuccess: boolean;
    Message?: string;

    constructor(isSuccess: boolean, Message?: string, Error?: ErrorModel) {
        this.Message = Message;
        this.isSuccess = isSuccess;
        this.Error = Error;
        this.HasError = (this.Error != undefined && this.Error.HasError);
    }
}