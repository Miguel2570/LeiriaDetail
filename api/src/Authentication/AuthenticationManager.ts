import { QueryTable, server } from '../Helpers/DatabaseConnectionHelper';
import { User } from './AuthenticationModel';

export class UserManager {
    // Listar todos os utilizadores
    static async getAllUsers(): Promise<User[]> {
        return await QueryTable('users');
    }

    // Criar um novo utilizador (Exemplo de INSERT)
    static async createUser(userData: User): Promise<User> {
        const q = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
        const params = [userData.email, userData.password];
        const result = await server.query(q, params);
        return result.rows[0];
    }
}