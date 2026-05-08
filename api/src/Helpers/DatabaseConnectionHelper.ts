import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da ligação usando a DATABASE_URL do Docker
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5, // equivalente ao connectionLimit
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Enums para garantir que não há erros de escrita no SQL
export enum EvaluationTypeEnum {
    EqualTo = "=",
    GreaterThan = ">",
    GreaterOrEqualThan = ">=",
    LessThan = "<",
    LessOrEqualThan = "<=",
    IsNull = "is null",
    IsNotNull = "is not null",
    In = "in",
    NotIn = "not in",
    default = "="
}

export enum OrdenationTypeEnum {
    ASC = "ASC",
    DESC = "DESC"
}

// Classe para construir as condições WHERE
export class EvaluationCondition {
    Field: string;
    EvaluationType: EvaluationTypeEnum;
    CompareValue: any;

    constructor(field: string, evaluationType?: EvaluationTypeEnum, compareValue?: any) {
        this.Field = field;
        this.EvaluationType = evaluationType ?? EvaluationTypeEnum.default;
        this.CompareValue = compareValue;
    }

    toString(): string {
        let compareValueString = "";
        
        if (this.EvaluationType !== EvaluationTypeEnum.IsNotNull && this.EvaluationType !== EvaluationTypeEnum.IsNull) {
            if (Array.isArray(this.CompareValue)) {
                compareValueString = `(${this.CompareValue.map(v => `'${v}'`).join(' , ')})`;
            } else if (typeof this.CompareValue === "number") {
                compareValueString = this.CompareValue.toString();
            } else {
                compareValueString = `'${this.CompareValue}'`;
            }
        }
        
        return ` AND ${this.Field} ${this.EvaluationType} ${compareValueString}`;
    }
}

export class OrderByCondition {
    Field: string;
    OrdenationType: OrdenationTypeEnum;

    constructor(field: string, ordenationType?: OrdenationTypeEnum) {
        this.Field = field;
        this.OrdenationType = ordenationType ?? OrdenationTypeEnum.ASC;
    }

    toString(): string {
        return ` ORDER BY ${this.Field} ${this.OrdenationType}`;
    }
}

/**
 * Função principal para consultar tabelas
 */
export async function QueryTable(
    DataTable: string, 
    Conditions?: Array<EvaluationCondition> | EvaluationCondition, 
    Ordenation?: OrderByCondition
): Promise<Array<any>> {
    let q = `SELECT * FROM ${DataTable} WHERE 1 = 1`;

    if (Conditions) {
        if (Array.isArray(Conditions)) {
            Conditions.forEach(c => q += c.toString());
        } else {
            q += Conditions.toString();
        }
    }

    if (Ordenation) {
        q += Ordenation.toString();
    }

    const result = await pool.query(q);
    return [...result.rows];
}

export const server = pool;