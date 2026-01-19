// services/users-service/routes.js
const express = require("express");
const User = require("../../models/User");
const Cost = require("../../models/Cost");
const { errorJson } = require("../../common/error");
const { createLogger } = require("../../common/logger");

const router = express.Router();
const { endpointAccessLog } = createLogger("users-service");

/*
 * Shared handler for creating a new user.
 * This function is reused by both POST /api/users (RESTful path) and POST /api/add (compatibility path)
 * to avoid duplicated logic while keeping both endpoints consistent.
 */
async function addUser(req, res) {
    // Extract user fields from the request body
    // Basic validation
    const { id, first_name, last_name, birthday } = req.body;

    if (
        typeof id !== "number" ||
        typeof first_name !== "string" ||
        typeof last_name !== "string" ||
        !birthday
    ) {
        return res.status(400).json(errorJson(400, "Invalid user data"));
    }

    // Persist the user only after validation and duplicate-id checks
    try {
        // Business rule: prevent duplicate user id
        const existingUser = await User.findOne({ id: id });
        if (existingUser) {
            return res.status(409).json(errorJson(409, "User already exists"));
        }

        // Create a new User document (note: id is an external identifier, not MongoDB _id)
        const user = new User({
            id: id,
            first_name: first_name,
            last_name: last_name,
            birthday: new Date(birthday)
        });

        // Save the user document to the database
        await user.save();

        return res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            birthday: user.birthday
        });
    } catch (err) {
        return res.status(500).json(errorJson(500, "Internal server error"));
    }
}


// List all users (returns the users collection documents as JSON)
// GET /api/users  -> list all users
router.get("/users", async (req, res) => {
    await endpointAccessLog(req, res, "GET /api/users");

    try {
        const users = await User.find({}).lean();
        return res.status(200).json(users);
    } catch (e) {
        return res.status(500).json(errorJson(500, "Failed to fetch users"));
    }
});

// Fetch a specific user's details and compute their total costs across all categories
// GET /api/users/:id -> details + total
router.get("/users/:id", async (req, res) => {
    await endpointAccessLog(req, res, "GET /api/users/:id");

    // Parse and validate the user id from the URL path
    const userid = Number(req.params.id);
    if (!Number.isInteger(userid)) {
        return res.status(400).json(errorJson(400, "Invalid user id"));
    }

    try {
        const user = await User.findOne(
            { id: userid },
            { _id: 0, id: 1, first_name: 1, last_name: 1, birthday: 1 }
        ).lean();

        if (!user) {
            return res.status(404).json(errorJson(404, "User not found"));
        }

        // Fetch all costs for this user in order to compute the total sum
        const costs = await Cost.find({ userid: userid }).lean();

        // Compute total costs by summing all cost items' 'sum' values
        let total = 0;
        for (const c of costs) {
            total += c.sum;
        }

        return res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (e) {
        return res.status(500).json(errorJson(500, "Failed to fetch user details"));
    }
});

// POST /api/users -> add user (recommended REST path)
router.post("/users", async (req, res) => {
    await endpointAccessLog(req, res, "POST /api/users");
    return addUser(req, res);
});

// Compatibility endpoint required by the assignment document/tests (POST /api/add for users service)
/**
 * Optional compatibility endpoint:
 * Some project docs confusingly mention POST /api/add for adding user.
 * This lets you pass tests if the tester hits /api/add on the users service.
 */
router.post("/add", async (req, res) => {
    await endpointAccessLog(req, res, "POST /api/add (user)");
    return addUser(req, res);
});

module.exports = router;
