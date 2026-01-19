/*
 * Represents an application user.
 * Users are identified by an external numeric `id` (distinct from MongoDB's internal `_id`)
 * and are referenced by cost items and reports throughout the system.
 */
// models/User.js
const mongoose = require("mongoose");

// Schema defining the structure of a user document
const UserSchema = new mongoose.Schema(
    {
        // External user identifier used by the API (not MongoDB's internal _id)
        id: { type: Number, required: true, unique: true, index: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        // User birth date, used only as user metadata (not for authentication)
        birthday: { type: Date, required: true }
    },
    { versionKey: false }
);

// Export the User model mapped to the "users" collection
module.exports = mongoose.model("User", UserSchema, "users");
