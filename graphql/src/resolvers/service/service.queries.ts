import { pool } from '../../db';

export const serviceQueries = {
    services: async () => {
        try {
            const res = await pool.query('SELECT * FROM services ORDER BY id ASC');
            return res.rows;
        } catch (err) {
            console.error("Erro ao procurar serviços:", err);
            throw new Error("Erro interno ao carregar os serviços.");
        }
    }
};