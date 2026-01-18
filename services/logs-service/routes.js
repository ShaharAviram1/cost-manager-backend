// services/logs-service/routes.js
const express = require("express");
const Log = require("../../models/Log");
const { errorJson } = require("../../common/error");
const { createLogger } = require("../../common/logger");

const router = express.Router();
const { endpointAccessLog } = createLogger("logs-service");

// GET /api/logs -> return all logs
router.get("/logs", async (req, res) => {
    await endpointAccessLog(req, res, "GET /api/logs");

    try {
        const logs = await Log.find({}).sort({ time: -1 });
        return res.status(200).json(logs);
    } catch (e) {
        return res.status(500).json(errorJson(500, "Failed to fetch logs"));
    }
});

module.exports = router;
