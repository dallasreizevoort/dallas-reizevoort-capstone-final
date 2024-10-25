import pool from "../config/db.js";
import UAParser from "ua-parser-js";
import geoip from "geoip-lite";
import { format } from "date-fns";

const insertUser = async (req, userID, displayName, email, country) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const parser = new UAParser();
    const result = parser.setUA(req.headers["user-agent"]).getResult();
    const browser = result.browser.name;
    const os = result.os.name;
    const device = result.device.vendor || "Unknown";

    const locationData = geoip.lookup(ipAddress);
    const location = locationData
      ? `${locationData.city}, ${locationData.region}, ${locationData.country}`
      : "Unknown";

    const lastLogin = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    // Log to console for debugging
    console.log({
      ipAddress,
      location,
      browser,
      os,
      device,
      lastLogin,
      createdAt,
    });

    const [rows] = await pool.query(
      `INSERT INTO users 
        (spotify_user_id, display_name, email, country, location, last_login, created_at, ip_address, browser, os, device) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) AS new_values
        ON DUPLICATE KEY UPDATE 
        display_name = new_values.display_name, 
        email = new_values.email, 
        country = new_values.country, 
        location = new_values.location, 
        last_login = new_values.last_login, 
        ip_address = new_values.ip_address, 
        browser = new_values.browser, 
        os = new_values.os, 
        device = new_values.device`,
      [
        userID,
        displayName,
        email,
        country,
        location,
        lastLogin,
        createdAt,
        ipAddress,
        browser,
        os,
        device,
      ]
    );

    console.log("User added/updated in database", rows);
    const [warnings] = await pool.query("SHOW WARNINGS");
    console.log("Warnings", warnings);

    return rows;
  } catch (err) {
    console.error("Error inserting/updating user", err);
    throw err;
  }
};

export { insertUser };
