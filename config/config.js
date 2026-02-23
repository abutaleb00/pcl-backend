// config/config.js
const path = require("path");
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";

require("dotenv").config({
    path: path.resolve(process.cwd(), envFile),
});

module.exports = {
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST, // Ensure this is 127.0.0.1
        port: Number(process.env.DB_PORT) || 3307, // Force Number type
        dialect: "mysql",
        dialectOptions: {
            connectTimeout: 60000 // High timeout for remote connections
        }
    }
};