// services/admin-service/routes.js
const express = require("express");
const { errorJson } = require("../../common/error");
const { createLogger } = require("../../common/logger");

const router = express.Router();
const { endpointAccessLog } = createLogger("admin-service");

// GET /api/about -> developers team list (first_name + last_name only)
router.get("/about", async (req, res) => {
    await endpointAccessLog(req, res, "GET /api/about");
    try {
        if (!process.env.TEAM_MEMBERS) {
            return res.status(500).json(errorJson(500, "TEAM_MEMBERS is not defined"));
        }

        const members = JSON.parse(process.env.TEAM_MEMBERS);
        return res.status(200).json(members);
    } catch (e) {
        return res.status(500).json(errorJson(500, "Failed to fetch team"));
    }
});

module.exports = router;
