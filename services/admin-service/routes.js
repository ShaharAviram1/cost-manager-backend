/*
 * Routes for the admin service.
 * This service exposes administrative endpoints that are not backed by database collections.
 * In particular, /api/about returns the developers team members and must not read from MongoDB
 * because the submitted database should be empty except for the single imaginary user.
 */
// services/admin-service/routes.js
const express = require("express");
const { errorJson } = require("../../common/error");
const { createLogger } = require("../../common/logger");

const router = express.Router();
// Initialize a logger instance scoped to the admin service
const { endpointAccessLog } = createLogger("admin-service");

// Developers team endpoint required by the assignment (no DB access; first_name + last_name only)
// GET /api/about -> developers team list (first_name + last_name only)
router.get("/about", async (req, res) => {
    await endpointAccessLog(req, res, "GET /api/about");
    try {
        // TEAM_MEMBERS is provided via environment (or hardcoded) to avoid storing developer names in the DB
        if (!process.env.TEAM_MEMBERS) {
            return res.status(500).json(errorJson(500, "TEAM_MEMBERS is not defined"));
        }

        // Parse the team members JSON array from the environment variable
        const members = JSON.parse(process.env.TEAM_MEMBERS);
        return res.status(200).json(members);
    // Handle invalid JSON or unexpected server errors
    } catch (e) {
        return res.status(500).json(errorJson(500, "Failed to fetch team"));
    }
});

// Export the admin service router
module.exports = router;
