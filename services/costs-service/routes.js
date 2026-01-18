// services/costs-service/routes.js
const express = require("express");
const Cost = require("../../models/Cost");
const Report = require("../../models/Report");
const User = require("../../models/User");
const { errorJson } = require("../../common/error");
const { createLogger } = require("../../common/logger");
const CATEGORIES = require("../../common/categories");

const router = express.Router();
const { endpointAccessLog } = createLogger("costs-service");

function isValidMonth(month) {
    return Number.isInteger(month) && month >= 1 && month <= 12;
}

function isValidYear(year) {
    return Number.isInteger(year) && year >= 1970 && year <= 3000;
}

async function generateReport(userid, year, month) {

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const costs = await Cost.find({ userid, createdAt: { $gte: start, $lt: end } }).lean();
    const grouped = {
        food: [],
        health: [],
        housing: [],
        sports: [],
        education: []
    };
    for (const c of costs) {
        grouped[c.category].push({
            sum: Number(c.sum),
            description: c.description,
            day: new Date(c.createdAt).getDate()
        });
    }
    const report = {
        userid: userid,
        year: year,
        month: month,
        costs: [
            { food: grouped.food },
            { health: grouped.health },
            { housing: grouped.housing },
            { sports: grouped.sports },
            { education: grouped.education }
        ]
    };
    return report;
}

// POST /api/add -> add cost item
router.post("/add", async (req, res) => {
    await endpointAccessLog(req, res, "POST /api/add (cost)");
    const { userid, description, category, sum, createdAt } = req.body;
    
    if (typeof description !== "string" ||
        typeof category !== "string" ||
        typeof userid !== "number" ||
        typeof sum !== "number"
    ) {
        return res.status(400).json(errorJson(400, "Invalid cost fields"));
    }

    if (!CATEGORIES.includes(category)) {
        return res.status(400).json(errorJson(400, "Invalid category"));
    }

    if (sum < 0) {
        return res.status(400).json(errorJson(400, "sum must be non-negative"));
    }
    
    // Date validation (if provided)
    let costDate = new Date();
    if (createdAt !== undefined) {
        const parsedDate = new Date(createdAt);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json(errorJson(400, "Invalid date"));
        }

        // Business rule: no past dates
        if (parsedDate < new Date()) {
            return res.status(400).json(errorJson(400, "Cannot add cost in the past"));
        }

        costDate = parsedDate;
    }
    try {
        // ===== Business logic =====
        const userExists = await User.findOne({ id: userid });
        if (!userExists) {
            return res.status(404).json(errorJson(404, "User does not exist"));
        }

        const cost = new Cost({
            userid,
            description,
            category,
            sum,
            createdAt: costDate
        });

        await cost.save();

        return res.status(200).json({
            userid: cost.userid,
            description: cost.description,
            category: cost.category,
            sum: Number(cost.sum),
            createdAt: cost.createdAt
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorJson(500, "Internal server error"));
    }
    
});

// GET /api/report?id=...&year=...&month=...
router.get("/report", async (req, res) => {
    await endpointAccessLog(req, res, "GET /api/report");

    const userid = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!Number.isInteger(userid)|| !Number.isInteger(year) || !Number.isInteger(month)) {
        return res.status(400).json(errorJson(400, "Missing id/year/month"));
    }

    if (!isValidYear(year) || !isValidMonth(month)) {
        return res.status(400).json(errorJson(400, "Invalid year or month"));
    }


    try {
        const userExists = await User.findOne({ id: userid });
        if (!userExists) {
            return res.status(404).json(errorJson(404, "User does not exist"));
        }
        const now = new Date();
        const past = (year < now.getFullYear()) || (year === now.getFullYear() && month < (now.getMonth()+1));
        if (past) {
            let report = await Report.findOne({ userid, year, month }).lean();
            if (!report) {
                report = await generateReport(userid, year, month);
                await Report.create(report);
            }
            return res.status(200).json(report);
        }
        else {
            return res.status(200).json(await generateReport(userid, year, month));
        }

    }
    catch (err) {
        console.error(err);
        return res.status(500).json(errorJson(500, "Internal server error"));
    }

});

module.exports = router;
