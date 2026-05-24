import { pool } from "../../db";

export const bookingQueries = {
  bookings: async () => {
    const res = await pool.query("SELECT * FROM bookings ORDER BY booking_date DESC");
    return res.rows;
  },
  // Faz um JOIN para trazer os dados do serviço e do veículo tudo junto!
  customerBookings: async (_: any, { user_id }: { user_id: number }) => {
    const query = `
      SELECT 
        b.id,
        b.user_id,
        b.booking_date,
        b.booking_time,
        b.status,
        b.created_at,
        v.brand as vehicle_brand,
        v.model as vehicle_model,
        v.license_plate as vehicle_plate,
        v.size_category,
        s.name as service_name,
        CASE 
          WHEN v.size_category = 'A' OR v.size_category = 'B' THEN s.price_ab
          WHEN v.size_category = 'C' THEN s.price_c
          WHEN v.size_category = 'D' OR v.size_category = 'E' THEN s.price_de
          ELSE s.price_c
        END as service_price
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN services s ON b.service_id = s.id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `;
    const res = await pool.query(query, [user_id]);
    
    return res.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      booking_date: row.booking_date,
      booking_time: row.booking_time,
      status: row.status,
      created_at: row.created_at,
      vehicle_name: `${row.vehicle_brand} ${row.vehicle_model}`,
      vehicle_plate: row.vehicle_plate,
      service_name: row.service_name,
      service_price: row.service_price
    }));
  }
};