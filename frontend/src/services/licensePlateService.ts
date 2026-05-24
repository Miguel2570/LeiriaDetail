const PORTUGUESE_PLATE_PATTERNS = [
    /^[A-Z]{2}-\d{2}-[A-Z]{2}$/,     // AA-11-BB
    /^\d{2}-\d{2}-[A-Z]{2}$/,        // 11-11-XX
    /^\d{2}-[A-Z]{2}-\d{2}$/,        // 11-XX-11
    /^[A-Z]{2}\d{2}[A-Z]{2}$/,       // AA11BB
    /^\d{2}\d{2}[A-Z]{2}$/,          // 1111XX
    /^\d{2}[A-Z]{2}\d{2}$/,          // 11XX11
];

const PREFIX_YEAR_MAP: Record<string, number> = {
    'AA': 2017, 'AB': 2017, 'AC': 2018, 'AD': 2018,
    'AE': 2019, 'AF': 2019, 'AG': 2020, 'AH': 2020,
    'AI': 2021, 'AJ': 2021, 'AK': 2022, 'AL': 2022,
    'AM': 2023, 'AN': 2023, 'AO': 2024, 'AP': 2024,
    'AQ': 2025, 'AR': 2025, 'AS': 2026, 'AT': 2026,
};

interface PlateInfo {
    isValid: boolean;
    cleanedPlate: string;
    estimatedYear: number | null;
    errorMessage?: string;
}

export function validatePortuguesePlate(plate: string): PlateInfo {
    const cleaned = plate.toUpperCase().replace(/[\s-]/g, '');
    
    // Formata com hífens
    const withHyphens = cleaned.length === 6 
        ? `${cleaned.slice(0,2)}-${cleaned.slice(2,4)}-${cleaned.slice(4,6)}`
        : cleaned;
    
    let isValid = false;
    
    for (const pattern of PORTUGUESE_PLATE_PATTERNS) {
        if (pattern.test(cleaned) || pattern.test(withHyphens)) {
            isValid = true;
            break;
        }
    }
    
    if (!isValid) {
        return {
            isValid: false,
            cleanedPlate: cleaned,
            estimatedYear: null,
            errorMessage: 'Formato de matrícula inválido. Ex: AA-11-BB'
        };
    }
    
    const prefix = cleaned.substring(0, 2);
    const estimatedYear = PREFIX_YEAR_MAP[prefix] || null;
    
    return {
        isValid: true,
        cleanedPlate: withHyphens,
        estimatedYear
    };
}