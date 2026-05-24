import { QueryTable, EvaluationCondition, EvaluationTypeEnum, server } from '../Helpers/DatabaseConnectionHelper';
import { User } from './AuthenticationModel';

export class UserManager {
    
    // Listar todos os utilizadores (Pode ser útil para um admin dashboard)
    static async getAllUsers(): Promise<User[]> {
        return await QueryTable('users');
    }

    // Procurar utilizador por Email (Crucial para Login e para evitar Registos Duplicados)
    static async getUserByEmail(email: string): Promise<User | null> {
        const condition = new EvaluationCondition("email", EvaluationTypeEnum.EqualTo, email);
        const users = await QueryTable('users', condition);
        return users.length > 0 ? users[0] : null;
    }

    // Criar um novo utilizador
    static async createUser(userData: User): Promise<User> {
        // Verifica se o utilizador já existe
        const existingUser = await this.getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error("O e-mail fornecido já se encontra registado.");
        }

        const q = 'INSERT INTO users (name, phone, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
        // Nota: Num cenário real em produção, NUNCA gravamos a password em plain-text. 
        // Idealmente usariamos "bcrypt" aqui, mas para já mantemos simples para tu testares a ligação.
        const params = [userData.name, userData.phone, userData.email, userData.password];
        
        const result = await server.query(q, params);
        return result.rows[0];
    }
}