import pool from "../config/db.js";

export async function getActiveRide(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT
          r.id,
          r.driver_id,
          r.vehicle_id,
          r.source_address,
          r.source_latitude,
          r.source_longitude,
          r.destination_address,
          r.destination_latitude,
          r.destination_longitude,
          DATE_FORMAT(r.departure_datetime, '%Y-%m-%d')
            AS departure_date,
          TIME_FORMAT(r.departure_datetime, '%H:%i:%s')
            AS departure_time,
          r.total_seats,
          r.available_seats,
          r.estimated_total_cost,
          r.distance_km,
          r.estimated_duration_minutes,
          r.status,
          r.started_at,
          r.created_at,
          r.updated_at,

          b.id AS booking_id,
          b.passenger_id,
          b.seats_booked,
          b.base_fare,
          b.student_discount_amount,
          b.final_fare,
          b.status AS booking_status,
          b.created_at AS booking_created_at,
          b.updated_at AS booking_updated_at,

          d.full_name AS driver_name,
          d.email AS driver_email,
          d.phone AS driver_phone,
          d.avatar_url AS driver_avatar,

          v.make AS vehicle_make,
          v.model AS vehicle_model,
          v.registration_number,
          v.color AS vehicle_color,
          v.total_seats AS vehicle_seats

       FROM bookings b
       INNER JOIN rides r ON r.id = b.ride_id
       INNER JOIN users d ON d.id = r.driver_id
       LEFT JOIN vehicles v ON v.id = r.vehicle_id

       WHERE b.passenger_id = ?
         AND b.status = 'confirmed'
         AND r.status = 'in_progress'

       ORDER BY r.started_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(200).json(null);
    }

    const row = rows[0];

    const activeRide = {
      id: String(row.id),
      driver_id: String(row.driver_id),
      vehicle_id: String(row.vehicle_id),
      source: row.source_address,
      destination: row.destination_address,

      source_coords: {
        lat: Number(row.source_latitude),
        lng: Number(row.source_longitude),
      },

      dest_coords: {
        lat: Number(row.destination_latitude),
        lng: Number(row.destination_longitude),
      },

      departure_date: row.departure_date,
      departure_time: row.departure_time,
      total_seats: row.total_seats,
      available_seats: row.available_seats,
      total_cost: Number(row.estimated_total_cost),
      distance_km: Number(row.distance_km || 0),
      duration_min: row.estimated_duration_minutes || 0,
      status: "active",
      stage: "in_progress",
      driver_location: null,
      location_updated_at: null,
      notes: "",
      created_at: row.created_at,
      updated_at: row.updated_at,

      driver: {
        id: String(row.driver_id),
        full_name: row.driver_name,
        email: row.driver_email,
        phone: row.driver_phone,
        role: "driver",
        status: "active",
        avatar_url: row.driver_avatar || "",
        rating: 0,
        total_trips: 0,
        created_at: "",
        updated_at: "",
      },

      vehicle: row.vehicle_id
        ? {
            id: String(row.vehicle_id),
            driver_id: String(row.driver_id),
            make: row.vehicle_make,
            model: row.vehicle_model,
            number: row.registration_number,
            color: row.vehicle_color,
            seats: row.vehicle_seats,
            registration_doc: "",
            created_at: "",
          }
        : null,

      booking: {
        id: String(row.booking_id),
        ride_id: String(row.id),
        passenger_id: String(row.passenger_id),
        seats: row.seats_booked,
        base_fare: Number(row.base_fare),
        discount: Number(row.student_discount_amount),
        final_fare: Number(row.final_fare),
        status: row.booking_status,
        created_at: row.booking_created_at,
        updated_at: row.booking_updated_at,
      },
    };

    return res.status(200).json(activeRide);
  } catch (error) {
    console.error("Get active ride error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load the active ride",
    });
  }
}