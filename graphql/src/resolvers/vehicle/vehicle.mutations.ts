import { pool } from "../../db";

export const vehicleMutations = {
  createVehicle: async (_: any, { input }: { input: any }) => {
    const { user_id, brand, model, license_plate } = input;
    const res = await pool.query(
      "INSERT INTO vehicles (user_id, brand, model, license_plate) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, brand, model, license_plate]
    );
    return res.rows[0];
  }
};