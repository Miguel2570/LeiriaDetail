// src/Helpers/FileHelper.ts

/**
 * Converte Buffer para base64 string
 */
export function bufferToBase64(buffer: Buffer): string {
    if (!buffer || !Buffer.isBuffer(buffer)) return '';
    return buffer.toString('base64');
}

/**
 * Converte base64 string ou Buffer para Buffer binário
 */
export function toBuffer(data: Buffer | string): Buffer {
    if (Buffer.isBuffer(data)) return data;
    if (typeof data === 'string') {
        // Remove o prefixo "data:image/png;base64," se existir
        const base64 = data.includes(',') ? data.split(',')[1] : data;
        return Buffer.from(base64, 'base64');
    }
    return Buffer.alloc(0);
}

/**
 * Obtém o MIME type a partir da extensão do ficheiro
 */
export function getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.tiff': 'image/tiff',
        '.ico': 'image/x-icon',
        '.pdf': 'application/pdf',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.zip': 'application/zip',
    };
    
    const ext = extension?.toLowerCase() || '';
    return mimeTypes[ext] || mimeTypes[`.${ext}`] || 'application/octet-stream';
}

/**
 * Converte base64 para Data URL completo
 */
export function base64ToDataUrl(base64: string, fileExtension: string): string {
    if (!base64) return '';
    if (base64.startsWith('data:')) return base64;
    
    const mimeType = getMimeTypeFromExtension(fileExtension);
    return `data:${mimeType};base64,${base64}`;
}

/**
 * Extrai todas as informações de um ficheiro do evento de input
 */
export async function getAllFileInfo(event: Event): Promise<{
    fileName: string;
    fileExtension: string;
    fileSize: number;
    fileData: string;
    file: File;
} | null> {
    const target = event.target as HTMLInputElement;
    
    if (!target.files || target.files.length === 0) return null;
    
    const file = target.files[0];
    const nameParts = file.name.split('.');
    const extension = nameParts.pop()?.toLowerCase() || '';
    const fileName = nameParts.join('.');
    
    // Converte para base64
    const fileData = await convertFileToBase64(file);
    
    return {
        fileName,
        fileExtension: extension,
        fileSize: file.size,
        fileData: fileData || '',
        file
    };
}

/**
 * Converte um File object para base64 string (sem prefixo data:)
 */
export function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.readAsDataURL(file);
        
        reader.onload = () => {
            const fullBase64String = reader.result as string;
            // Remove o prefixo "data:image/png;base64,"
            const base64Data = fullBase64String.split(',')[1] || '';
            resolve(base64Data);
        };
        
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            reject(error);
        };
    });
}

/**
 * Converte um File object para IFile
 */
export async function convertFileToIFile(file: File): Promise<{
    FileName: string;
    FileSize: number;
    FileExtension: string;
    FileData: string;
}> {
    const nameParts = file.name.split('.');
    const extension = nameParts.pop()?.toLowerCase() || '';
    const fileName = nameParts.join('.');
    const fileData = await convertFileToBase64(file);
    
    return {
        FileName: fileName,
        FileSize: file.size,
        FileExtension: extension,
        FileData: fileData
    };
}