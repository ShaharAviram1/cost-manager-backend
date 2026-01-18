// models/Report.js
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
    {
        userid: { type: Number, required: true, index: true },
        year: { type: Number, required: true, index: true },
        month: { type: Number, required: true, index: true }, // 1..12
        costs: { type: Array, required: true },
        created_at: { type: Date, required: true, default: Date.now }
    },
    { versionKey: false }
);

ReportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Report", ReportSchema, "reports");
