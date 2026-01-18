// models/Cost.js
const { Double } = require("bson");
const mongoose = require("mongoose");
const CATEGORIES = require("../common/categories");

const CostSchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        category: { type: String, required: true, enum: CATEGORIES },
        userid: { type: Number, required: true, index: true },

        sum: { type: Double, required: true },

        // Used for month/year filtering and "day" in report.
        createdAt: { type: Date, required: true, default: Date.now }
    },
    { versionKey: false }
);

module.exports = mongoose.model("Cost", CostSchema, "costs");
