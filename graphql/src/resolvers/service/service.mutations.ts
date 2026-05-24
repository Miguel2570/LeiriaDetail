import { pool } from "../../db";

export const serviceMutations = {
  createService: async (_: any, { input }: { input: any }) => {
    const { name, description, price, duration_minutes } = input;
    
    const res = await pool.query(
      "INSERT INTO services (name, description, price, duration_minutes) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, duration_minutes]
    );
    
    return res.rows[0];
  }
};