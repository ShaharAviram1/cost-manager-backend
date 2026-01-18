// tests/logs.test.js
const request = require("supertest");

const LOGS_BASE = "http://localhost:3003";

describe("Logs service", () => {
    test("GET /api/logs returns array", async () => {
        const res = await request(LOGS_BASE).get("/api/logs");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
