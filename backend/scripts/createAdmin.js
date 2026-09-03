import "dotenv/config";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

async function createAdmin() {
  try {
    const password = process.env.ADMIN_PASSWORD;

    if (!password || password.length < 8) {
      throw new Error(
        "Set ADMIN_PASSWORD with at least 8 characters before running this script"
      );
    }

    const email = "admin@uniride.com";
    const phone = "9999999999";

    const [existingUsers] = await pool.execute(
      `SELECT id FROM users WHERE email = ? OR phone = ? LIMIT 1`,
      [email, phone]
    );

    if (existingUsers.length > 0) {
      console.log("Admin account already exists");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.execute(
      `INSERT INTO users
        (full_name, email, phone, password_hash, role, account_status)
       VALUES (?, ?, ?, ?, 'admin', 'active')`,
      ["UniRide Admin", email, phone, passwordHash]
    );

    console.log("Admin account created successfully");
    console.log(`Admin email: ${email}`);
  } catch (error) {
    console.error("Unable to create admin:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();