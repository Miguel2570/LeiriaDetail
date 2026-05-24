// src/services/licensePlateService.ts

interface PlateInfo {
    isValid: boolean;
    cleanedPlate: string;
    country: string | null;
    estimatedYear: number | null;
    errorMessage?: string;
}

// Prefixos portugueses para estimar ano
const PT_PREFIX_YEAR: Record<string, number> = {
    'AA': 2017, 'AB': 2017, 'AC': 2018, 'AD': 2018,
    'AE': 2019, 'AF': 2019, 'AG': 2020, 'AH': 2020,
    'AI': 2021, 'AJ': 2021, 'AK': 2022, 'AL': 2022,
    'AM': 2023, 'AN': 2023, 'AO': 2024, 'AP': 2024,
    'AQ': 2025, 'AR': 2025, 'AS': 2026, 'AT': 2026,
};

// Formatos de matrícula por país
const PLATE_PATTERNS: Record<string, RegExp[]> = {
    'PT': [
        /^[A-Z]{2}-\d{2}-[A-Z]{2}$/,     // AA-11-BB
        /^\d{2}-\d{2}-[A-Z]{2}$/,        // 11-11-XX
        /^\d{2}-[A-Z]{2}-\d{2}$/,        // 11-XX-11
        /^[A-Z]{2}\d{2}[A-Z]{2}$/,       // AA11BB
    ],
    'ES': [
        /^\d{4}[A-Z]{3}$/,               // 1234ABC
        /^[A-Z]{1,2}\d{4}[A-Z]{1,2}$/,   // B1234AB
    ],
    'FR': [
        /^[A-Z]{2}-\d{3}-[A-Z]{2}$/,     // AA-123-BB
        /^[A-Z]{2}\d{3}[A-Z]{2}$/,       // AA123BB
    ],
    'DE': [
        /^[A-Z]{1,3}-[A-Z]{1,2}\d{1,4}$/, // B-BB1234
    ],
    'UK': [
        /^[A-Z]{2}\d{2}[A-Z]{3}$/,       // AB12CDE
        /^[A-Z]\d{1,3}[A-Z]{3}$/,        // A123BCD
    ],
    'BR': [
        /^[A-Z]{3}\d{4}$/,               // ABC1234
        /^[A-Z]{3}\d[A-Z]\d{2}$/,        // ABC1D23 (Mercosul)
    ],
};

/**
 * Valida matrícula internacional
 */
export function validateLicensePlate(plate: string): PlateInfo {
    const cleaned = plate.toUpperCase().replace(/[\s-]/g, '');
    
    if (cleaned.length < 2) {
        return {
            isValid: false,
            cleanedPlate: cleaned,
            country: null,
            estimatedYear: null,
            errorMessage: 'Matrícula demasiado curta.'
        };
    }
    
    // Tentar cada país
    for (const [country, patterns] of Object.entries(PLATE_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(cleaned)) {
                // Formatar com hífens se for PT
                const formatted = country === 'PT' && cleaned.length === 6
                    ? `${cleaned.slice(0,2)}-${cleaned.slice(2,4)}-${cleaned.slice(4,6)}`
                    : cleaned;
                
                // Estimar ano só para PT
                let estimatedYear = null;
                if (country === 'PT') {
                    const prefix = cleaned.substring(0, 2);
                    estimatedYear = PT_PREFIX_YEAR[prefix] || null;
                }
                
                return {
                    isValid: true,
                    cleanedPlate: formatted,
                    country,
                    estimatedYear
                };
            }
        }
    }
    
    // Se não bateu em nenhum padrão, aceitar como válido na mesma
    return {
        isValid: true,  // ← Aceitamos matrículas de qualquer país
        cleanedPlate: cleaned,
        country: null,
        estimatedYear: null
    };
}