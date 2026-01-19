/*
 * Represents a cached monthly cost report for a specific user.
 * Report documents may be stored for past months as part of the Computed Design Pattern
 * to avoid recomputing the same report multiple times.
 * Once created, cached reports should be treated as immutable.
 */
// models/Report.js
const mongoose = require("mongoose");

// Schema defining the structure of a computed monthly report document
const ReportSchema = new mongoose.Schema(
    {
        userid: { type: Number, required: true, index: true },
        year: { type: Number, required: true, index: true },
        month: { type: Number, required: true, index: true }, // 1..12
        // Costs grouped by category, matching the JSON structure returned by /api/report
        costs: { type: Array, required: true },
        // Creation timestamp for this cached report document
        created_at: { type: Date, required: true, default: Date.now }
    },
    { versionKey: false }
);

// Ensure one unique report per user per (year, month)
ReportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

// Export the Report model mapped to the "reports" collection
module.exports = mongoose.model("Report", ReportSchema, "reports");
