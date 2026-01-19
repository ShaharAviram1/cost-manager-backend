/*
 * Routes for the logs service.
 * This service is responsible for exposing administrative access
 * to system logs that are collected via the centralized logger.
 * Logs are read-only and intended for monitoring and debugging purposes.
 */
// services/logs-service/routes.js
const express = require("express");
const Log = require("../../models/Log");
const { errorJson } = require("../../common/error");
const { createLogger } = require("../../common/logger");

// Initialize a logger instance scoped to the logs service
const router = express.Router();
const { endpointAccessLog } = createLogger("logs-service");

// Retrieve all log entries sorted by most recent first
// GET /api/logs -> return all logs
router.get("/logs", async (req, res) => {
    // Log explicit access to the logs endpoint
    await endpointAccessLog(req, res, "GET /api/logs");

    try {
        // Fetch logs from the database in descending order by timestamp
        const logs = await Log.find({}).sort({ time: -1 });
        return res.status(200).json(logs);
    } 
    // Handle unexpected database or server errors
    catch (e) {
        return res.status(500).json(errorJson(500, "Failed to fetch logs"));
    }
});

// Export the logs service router
module.exports = router;
