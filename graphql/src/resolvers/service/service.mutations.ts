import { pool } from "../../db";

export const serviceMutations = {
  createService: async (_: any, { input }: { input: any }) => {
    const { name, description, priceAB, priceC, priceDE, durationMinutes, packType } = input;
    
    const res = await pool.query(
      `INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, priceAB, priceC, priceDE, durationMinutes, packType || 'Básico']
    );
    
    return res.rows[0];
  },

  updateService: async (_: any, { id, input }: { id: string; input: any }) => {
    const { name, description, priceAB, priceC, priceDE, durationMinutes, packType } = input;
    
    const res = await pool.query(
      `UPDATE services 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price_ab = COALESCE($3, price_ab),
           price_c = COALESCE($4, price_c),
           price_de = COALESCE($5, price_de),
           duration_minutes = COALESCE($6, duration_minutes),
           pack_type = COALESCE($7, pack_type)
       WHERE id = $8 RETURNING *`,
      [name, description, priceAB, priceC, priceDE, durationMinutes, packType, id]
    );
    
    return res.rows[0];
  },

  deleteService: async (_: any, { id }: { id: string }) => {
    await pool.query("DELETE FROM services WHERE id = $1", [id]);
    return { success: true };
  }
};