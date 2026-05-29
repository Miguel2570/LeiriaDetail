// src/Helpers/FileHelper.ts

/**
 * Converte um File object para base64 string (sem prefixo "data:")
 * ✅ SEM COMPRESSÃO - mantém qualidade original
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
            console.error('❌ Error reading file:', error);
            reject(error);
        };
    });
}

/**
 * Converte um File object para o formato IFile (completo)
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

/**
 * Converte base64 para Data URL completo (para usar em <img src="">)
 * Ex: "iVBORw0..." → "data:image/png;base64,iVBORw0..."
 */
export function base64ToDataUrl(base64: string, fileExtension: string): string {
    if (!base64) return '';
    if (base64.startsWith('data:')) return base64;
    
    const mimeType = getMimeTypeFromExtension(fileExtension);
    return `data:${mimeType};base64,${base64}`;
}

/**
 * Obtém o MIME type a partir da extensão do ficheiro
 */
export function getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'tiff': 'image/tiff',
        'ico': 'image/x-icon',
        'heic': 'image/heic',
        'heif': 'image/heif',
        'avif': 'image/avif',
        'pdf': 'application/pdf',
        'json': 'application/json',
        'xml': 'application/xml',
        'zip': 'application/zip',
    };
    
    // Remove o ponto se existir
    const ext = extension?.replace('.', '').toLowerCase() || '';
    return mimeTypes[ext] || 'image/jpeg';
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
 * Comprime uma imagem base64 (reduz qualidade - usar apenas quando necessário!)
 * ⚠️ Usar com moderação - causa perda de qualidade
 */
export function compressBase64Image(
    base64: string, 
    maxWidth: number = 1920, 
    quality: number = 0.85
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${base64}`;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Só redimensiona se for maior que maxWidth
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
            resolve(compressedBase64);
        };
        
        img.onerror = reject;
    });
}

/**
 * Verifica se uma string é um base64 válido
 */
export function isValidBase64(str: string): boolean {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

/**
 * Obtém o tamanho de um ficheiro em formato legível
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Cria um input file temporário e retorna o(s) ficheiro(s) selecionado(s)
 */
export function triggerFileUpload(
    accept: string = 'image/*',
    multiple: boolean = false
): Promise<FileList | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        
        input.onchange = () => {
            resolve(input.files);
        };
        
        input.oncancel = () => {
            resolve(null);
        };
        
        input.click();
    });
}

/**
 * Converte um Blob para base64
 */
export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1] || '');
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Converte uma URL de imagem para base64
 */
export async function urlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return blobToBase64(blob);
}

/**
 * Obtém a extensão de um ficheiro a partir do nome
 */
export function getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
}

/**
 * Obtém o nome do ficheiro sem extensão
 */
export function getFileNameWithoutExtension(fileName: string): string {
    return fileName.split('.').slice(0, -1).join('.');
}