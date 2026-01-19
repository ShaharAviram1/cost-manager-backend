/*
 * MongoDB connection utility.
 * This module is responsible for establishing a single Mongoose connection
 * using the connection string provided via the MONGODB_URI environment variable.
 * It is imported and used by each service at startup.
 */
const mongoose = require("mongoose");

// Establish a connection to MongoDB using Mongoose
async function connectToMongo() {
    // Enforce strict query filtering to avoid unintended query behavior
    mongoose.set("strictQuery", true);
    // Connect to MongoDB using the URI supplied through environment configuration
    await mongoose.connect(process.env.MONGODB_URI);
}

// Export the MongoDB connection helper for reuse across services
module.exports = { connectToMongo };
