// src/File/FileRoutes.ts
import { Request, Response, Router } from "express";
import FileManager from "./FileManager";
import {
    GetAllFilesOutputModel,
    GetFileByIdOutputModel,
    CreateFileOutputModel,
    UpdateFileOutputModel,
    DeleteFileOutputModel
} from "./FileModel";
import { ErrorModel } from "../Helpers/ErrorModel";

const router = Router();

// GET - Listar todos os ficheiros
async function GetAllFiles(request: Request, response: Response) {
    try {
        const limit = parseInt(request.query.limit as string) || 50;
        const offset = parseInt(request.query.offset as string) || 0;
        const relatedEntityType = request.query.entityType as string;
        const relatedEntityId = request.query.entityId ? parseInt(request.query.entityId as string) : undefined;
        
        const result = await FileManager.GetAllFiles(limit, offset, relatedEntityType, relatedEntityId);
        response.status(200).json(result);
    } catch (error: any) {
        response.status(500).json(
            new GetAllFilesOutputModel(undefined, new ErrorModel("Server", error.message))
        );
    }
}

// GET - Ficheiro por ID
async function GetFileById(request: Request, response: Response) {
    try {
        const id = request.params.id;
        
        if (!id) {
            response.status(400).json(
                new GetFileByIdOutputModel(undefined, new ErrorModel("Id", "Id is required"))
            );
            return;
        }
        
        const result = await FileManager.GetFileById(id);
        response.status(200).json(result);
    } catch (error: any) {
        response.status(500).json(
            new GetFileByIdOutputModel(undefined, new ErrorModel("Server", error.message))
        );
    }
}

// GET - Ficheiros por entidade
async function GetFilesByEntity(request: Request, response: Response) {
    try {
        const entityType = request.params.entityType;
        const entityId = parseInt(request.params.entityId);
        
        if (!entityType || !entityId) {
            response.status(400).json(
                new GetAllFilesOutputModel(undefined, new ErrorModel("Params", "entityType and entityId are required"))
            );
            return;
        }
        
        const result = await FileManager.GetFilesByEntity(entityType, entityId);
        response.status(200).json(result);
    } catch (error: any) {
        response.status(500).json(
            new GetAllFilesOutputModel(undefined, new ErrorModel("Server", error.message))
        );
    }
}

// POST - Criar ficheiro
async function CreateFile(request: Request, response: Response) {
    try {
        const { fileName, fileSize, fileData, fileExtension, relatedEntityType, relatedEntityId, tags } = request.body;
        const createUser = request.headers["user-id"] as string || "system";
        
        if (!fileName) {
            response.status(400).json(
                new CreateFileOutputModel(undefined, new ErrorModel("FileName", "File name is required"))
            );
            return;
        }
        
        if (!fileData) {
            response.status(400).json(
                new CreateFileOutputModel(undefined, new ErrorModel("FileData", "File data is required"))
            );
            return;
        }
        
        const result = await FileManager.CreateFile(
            fileData,
            fileName,
            fileSize || 0,
            fileExtension || "png",
            createUser,
            relatedEntityType,
            relatedEntityId,
            tags
        );
        
        response.status(201).json(result);
    } catch (error: any) {
        response.status(500).json(
            new CreateFileOutputModel(undefined, new ErrorModel("Server", error.message))
        );
    }
}

// PUT - Atualizar ficheiro
async function UpdateFile(request: Request, response: Response) {
    try {
        const id = request.params.id;
        const { fileName, fileSize, fileData, fileExtension, tags } = request.body;
        const changeUser = request.headers["user-id"] as string || "system";
        
        if (!id) {
            response.status(400).json(
                new UpdateFileOutputModel(undefined, new ErrorModel("Id", "Id is required"))
            );
            return;
        }
        
        const result = await FileManager.UpdateFile(
            id,
            changeUser,
            fileData,
            fileName,
            fileSize,
            fileExtension,
            tags
        );
        
        response.status(200).json(result);
    } catch (error: any) {
        response.status(500).json(
            new UpdateFileOutputModel(undefined, new ErrorModel("Server", error.message))
        );
    }
}

// DELETE - Remover ficheiro
async function DeleteFile(request: Request, response: Response) {
    try {
        const id = request.params.id;
        const changeUser = request.headers["user-id"] as string || "system";
        
        if (!id) {
            response.status(400).json(
                new DeleteFileOutputModel(false, "Id is required", new ErrorModel("Id", "Id is required"))
            );
            return;
        }
        
        const result = await FileManager.DeleteFile(id, changeUser);
        response.status(200).json(result);
    } catch (error: any) {
        response.status(500).json(
            new DeleteFileOutputModel(false, undefined, new ErrorModel("Server", error.message))
        );
    }
}

router.get("/", GetAllFiles);
router.get("/:id", GetFileById);
router.get("/entity/:entityType/:entityId", GetFilesByEntity);
router.post("/", CreateFile);
router.put("/:id", UpdateFile);
router.delete("/:id", DeleteFile);

export default router;