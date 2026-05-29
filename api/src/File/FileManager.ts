// src/File/FileManager.ts
import { server, QueryTable, EvaluationCondition, EvaluationTypeEnum, OrderByCondition, OrdenationTypeEnum } from "../Helpers/DatabaseConnectionHelper";
import {
    IFile,
    GetAllFilesOutputModel,
    GetFileByIdOutputModel,
    CreateFileOutputModel,
    UpdateFileOutputModel,
    DeleteFileOutputModel
} from "./FileModel";
import { ErrorModel } from "../Helpers/ErrorModel";
import { bufferToBase64, toBuffer } from "../Helpers/FileHelper";

class FileManager {
    
    /**
     * Lista todos os ficheiros com paginação
     */
    static async GetAllFiles(
        limit: number = 50,
        offset: number = 0,
        relatedEntityType?: string,
        relatedEntityId?: number
    ): Promise<GetAllFilesOutputModel> {
        try {
            let query = `
                SELECT Id, FileName, FileExtension, FileSize, FileData,
                       RelatedEntityType, RelatedEntityId, Tags
                FROM File
                WHERE 1=1
            `;
            
            const params: any[] = [];
            let paramCount = 0;
            
            if (relatedEntityType) {
                paramCount++;
                query += ` AND RelatedEntityType = $${paramCount}`;
                params.push(relatedEntityType);
            }
            
            if (relatedEntityId) {
                paramCount++;
                query += ` AND RelatedEntityId = $${paramCount}`;
                params.push(relatedEntityId);
            }
            
            paramCount++;
            query += ` ORDER BY createdate DESC LIMIT $${paramCount}`;
            params.push(limit);
            
            paramCount++;
            query += ` OFFSET $${paramCount}`;
            params.push(offset);
            
            const result = await server.query(query, params);
            
            const files: IFile[] = result.rows.map((row: any) => ({
                Id: row.id,
                FileName: row.filename,
                FileExtension: row.fileextension,
                FileSize: parseInt(row.filesize),
                FileData: bufferToBase64(row.filedata),
                RelatedEntityType: row.relatedentitytype,
                RelatedEntityId: row.relatedentityid,
                Tags: row.tags || []
            }));
            
            return new GetAllFilesOutputModel(files, undefined);
        } catch (error: any) {
            console.error("❌ GetAllFiles error:", error);
            return new GetAllFilesOutputModel(
                undefined,
                new ErrorModel("Database", error?.message ?? "Error listing files")
            );
        }
    }
    
    /**
     * Busca ficheiro por ID
     */
    static async GetFileById(id: string): Promise<GetFileByIdOutputModel> {
        try {
            const query = `
                SELECT Id, FileName, FileData, FileSize, FileExtension,
                       RelatedEntityType, RelatedEntityId, Tags
                FROM File
                WHERE Id = $1
            `;
            
            const result = await server.query(query, [id]);
            
            if (result.rowCount === 0) {
                return new GetFileByIdOutputModel(
                    undefined,
                    new ErrorModel("Id", "File not found")
                );
            }
            
            const row = result.rows[0];
            
            const file: IFile = {
                Id: row.id,
                FileName: row.filename,
                FileExtension: row.fileextension,
                FileSize: parseInt(row.filesize),
                FileData: bufferToBase64(row.filedata),
                RelatedEntityType: row.relatedentitytype,
                RelatedEntityId: row.relatedentityid,
                Tags: row.tags || []
            };
            
            return new GetFileByIdOutputModel(file, undefined);
        } catch (error: any) {
            console.error("❌ GetFileById error:", error);
            return new GetFileByIdOutputModel(
                undefined,
                new ErrorModel("Database", error?.message ?? "Error fetching file")
            );
        }
    }
    
    /**
     * Cria um novo ficheiro
     */
    static async CreateFile(
        fileData: Buffer | string,
        fileName: string,
        fileSize: number,
        fileExtension: string,
        createUser: string,
        relatedEntityType?: string,
        relatedEntityId?: number,
        tags?: string[]
    ): Promise<CreateFileOutputModel> {
        try {
            if (!fileData) {
                return new CreateFileOutputModel(
                    undefined,
                    new ErrorModel("FileData", "File data is required")
                );
            }
            
            // Converte para Buffer binário (mantém qualidade original)
            const buf = toBuffer(fileData);
            
            if (!Buffer.isBuffer(buf) || buf.length === 0) {
                return new CreateFileOutputModel(
                    undefined,
                    new ErrorModel("FileData", "Invalid file data (base64/Buffer empty)")
                );
            }
            
            const query = `
                INSERT INTO File (
                    Id, FileName, FileExtension, FileSize, FileData,
                    RelatedEntityType, RelatedEntityId, Tags,
                    createdate, createuser, changedate, changeuser
                )
                VALUES (
                    gen_random_uuid(),
                    $1, $2, $3, $4,
                    $5, $6, $7,
                    NOW(), $8, NOW(), $8
                )
                RETURNING Id, FileName, FileExtension, FileSize, FileData,
                          RelatedEntityType, RelatedEntityId, Tags
            `;
            
            const result = await server.query(query, [
                fileName,
                fileExtension,
                fileSize,
                buf,
                relatedEntityType || null,
                relatedEntityId || null,
                tags || [],
                createUser
            ]);
            
            const row = result.rows[0];
            
            const file: IFile = {
                Id: row.id,
                FileName: row.filename,
                FileExtension: row.fileextension,
                FileSize: parseInt(row.filesize),
                FileData: bufferToBase64(row.filedata),
                RelatedEntityType: row.relatedentitytype,
                RelatedEntityId: row.relatedentityid,
                Tags: row.tags || []
            };
            
            console.log("✅ File created:", file.Id, file.FileName);
            return new CreateFileOutputModel(file, undefined);
        } catch (error: any) {
            console.error("❌ CreateFile error:", error);
            return new CreateFileOutputModel(
                undefined,
                new ErrorModel("Database", error?.message ?? "Error creating file")
            );
        }
    }
    
    /**
     * Atualiza um ficheiro existente
     */
    static async UpdateFile(
        id: string,
        changeUser: string,
        fileData?: Buffer | string,
        fileName?: string,
        fileSize?: number,
        fileExtension?: string,
        tags?: string[]
    ): Promise<UpdateFileOutputModel> {
        try {
            // Verifica se o ficheiro existe
            const existingFile = await this.GetFileById(id);
            if (!existingFile.File?.Id) {
                return new UpdateFileOutputModel(
                    undefined,
                    new ErrorModel("Id", "File not found")
                );
            }
            
            const updates: string[] = [];
            const values: any[] = [];
            let p = 1;
            
            if (fileName !== undefined && fileName !== "") {
                updates.push(`FileName = $${p++}`);
                values.push(fileName);
            }
            
            if (fileSize !== undefined && fileSize > 0) {
                updates.push(`FileSize = $${p++}`);
                values.push(fileSize);
            }
            
            if (fileExtension !== undefined && fileExtension !== "") {
                updates.push(`FileExtension = $${p++}`);
                values.push(fileExtension);
            }
            
            if (fileData !== undefined && fileData !== "") {
                const buf = toBuffer(fileData);
                
                if (!Buffer.isBuffer(buf) || buf.length === 0) {
                    return new UpdateFileOutputModel(
                        undefined,
                        new ErrorModel("FileData", "Invalid file data (base64/Buffer empty)")
                    );
                }
                
                updates.push(`FileData = $${p++}`);
                values.push(buf);
            }
            
            if (tags !== undefined) {
                updates.push(`Tags = $${p++}`);
                values.push(tags);
            }
            
            if (updates.length === 0) {
                return new UpdateFileOutputModel(existingFile.File, undefined);
            }
            
            updates.push(`changedate = NOW()`);
            updates.push(`changeuser = $${p++}`);
            values.push(changeUser);
            
            values.push(id);
            
            const query = `
                UPDATE File
                SET ${updates.join(", ")}
                WHERE Id = $${p}
                RETURNING Id, FileName, FileExtension, FileSize, FileData,
                          RelatedEntityType, RelatedEntityId, Tags
            `;
            
            const result = await server.query(query, values);
            
            if (result.rowCount === 0) {
                return new UpdateFileOutputModel(
                    undefined,
                    new ErrorModel("Id", "File not found or no changes made")
                );
            }
            
            const row = result.rows[0];
            
            const updatedFile: IFile = {
                Id: row.id,
                FileName: row.filename,
                FileExtension: row.fileextension,
                FileSize: parseInt(row.filesize),
                FileData: bufferToBase64(row.filedata),
                RelatedEntityType: row.relatedentitytype,
                RelatedEntityId: row.relatedentityid,
                Tags: row.tags || []
            };
            
            console.log("✅ File updated:", updatedFile.Id);
            return new UpdateFileOutputModel(updatedFile, undefined);
        } catch (error: any) {
            console.error("❌ UpdateFile error:", error);
            return new UpdateFileOutputModel(
                undefined,
                new ErrorModel("Database", error?.message ?? "Error updating file")
            );
        }
    }
    
    /**
     * Remove um ficheiro
     */
    static async DeleteFile(id: string, changeUser: string): Promise<DeleteFileOutputModel> {
        try {
            const existingFile = await this.GetFileById(id);
            if (!existingFile.File?.Id) {
                return new DeleteFileOutputModel(
                    false,
                    undefined,
                    new ErrorModel("Id", "File not found")
                );
            }
            
            const query = `DELETE FROM File WHERE Id = $1`;
            await server.query(query, [id]);
            
            console.log("✅ File deleted:", id);
            return new DeleteFileOutputModel(true, "File deleted successfully");
        } catch (error: any) {
            console.error("❌ DeleteFile error:", error);
            return new DeleteFileOutputModel(
                false,
                undefined,
                new ErrorModel("Database", error?.message ?? "Error deleting file")
            );
        }
    }
    
    /**
     * Busca ficheiros relacionados a uma entidade (ex: fotos de um veículo)
     */
    static async GetFilesByEntity(
        entityType: string,
        entityId: number
    ): Promise<GetAllFilesOutputModel> {
        return this.GetAllFiles(100, 0, entityType, entityId);
    }
    
    /**
     * Busca ficheiros por tags
     */
    static async GetFilesByTags(
        tags: string[],
        limit: number = 50
    ): Promise<GetAllFilesOutputModel> {
        try {
            const query = `
                SELECT Id, FileName, FileExtension, FileSize, FileData,
                       RelatedEntityType, RelatedEntityId, Tags
                FROM File
                WHERE Tags && $1::text[]
                ORDER BY createdate DESC
                LIMIT $2
            `;
            
            const result = await server.query(query, [tags, limit]);
            
            const files: IFile[] = result.rows.map((row: any) => ({
                Id: row.id,
                FileName: row.filename,
                FileExtension: row.fileextension,
                FileSize: parseInt(row.filesize),
                FileData: bufferToBase64(row.filedata),
                RelatedEntityType: row.relatedentitytype,
                RelatedEntityId: row.relatedentityid,
                Tags: row.tags || []
            }));
            
            return new GetAllFilesOutputModel(files, undefined);
        } catch (error: any) {
            console.error("❌ GetFilesByTags error:", error);
            return new GetAllFilesOutputModel(
                undefined,
                new ErrorModel("Database", error?.message ?? "Error fetching files by tags")
            );
        }
    }
}

export default FileManager;