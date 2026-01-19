/*
 * Represents a single cost item created by a user.
 * Cost documents are the atomic data used to generate monthly reports.
 * The `createdAt` field is later used for month/year filtering and day-of-month extraction.
 */
// models/Cost.js
const { Double } = require("bson");
const mongoose = require("mongoose");
// Allowed cost categories enforced at the schema level
const CATEGORIES = require("../common/categories");

// Schema defining the structure of a cost document
const CostSchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        category: { type: String, required: true, enum: CATEGORIES },
        // External user identifier (distinct from MongoDB's internal _id)
        userid: { type: Number, required: true, index: true },

        // Monetary value stored as MongoDB Double (bson Double type)
        sum: { type: Double, required: true },

        // Timestamp used for report generation (month/year filtering and day calculation)
        // Used for month/year filtering and "day" in report.
        createdAt: { type: Date, required: true, default: Date.now }
    },
    { versionKey: false }
);
// Export the Cost model mapped to the "costs" collection
module.exports = mongoose.model("Cost", CostSchema, "costs");
