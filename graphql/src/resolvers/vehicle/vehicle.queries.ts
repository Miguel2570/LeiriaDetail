import { pool } from "../../db";

export const vehicleQueries = {
  customerVehicles: async (_: any, { user_id }: { user_id: number }) => {
    const res = await pool.query(
      "SELECT * FROM vehicles WHERE user_id = $1 ORDER BY id DESC", 
      [user_id]
    );
    return res.rows;
  }
};