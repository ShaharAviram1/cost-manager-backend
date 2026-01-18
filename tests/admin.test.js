// tests/admin.test.js
const request = require("supertest");

const ADMIN_BASE = "http://localhost:3004";

describe("Admin service", () => {
    test("GET /api/about returns team array", async () => {
        const res = await request(ADMIN_BASE).get("/api/about");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        // Each object should have only first_name + last_name
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("first_name");
            expect(res.body[0]).toHaveProperty("last_name");
        }
    });
});
