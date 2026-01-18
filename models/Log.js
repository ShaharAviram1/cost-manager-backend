// models/Log.js
const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
    {
        time: { type: Date, required: true, default: Date.now },
        service: { type: String, required: true },
        level: { type: String, required: true }, // info / error
        method: { type: String, required: true },
        path: { type: String, required: true },
        status: { type: Number, required: true },
        message: { type: String, required: true },
        meta: { type: Object }
    },
    { versionKey: false }
);

module.exports = mongoose.model("Log", LogSchema, "logs");
