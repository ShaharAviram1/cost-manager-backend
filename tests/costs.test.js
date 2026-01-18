// tests/costs.test.js
const request = require("supertest");

const COSTS_BASE = "http://localhost:3002";

describe("Costs service", () => {
    test("POST /api/add adds a cost (with future created_at)", async () => {
        const future = new Date(Date.now() + 60 * 1000).toISOString();

        const res = await request(COSTS_BASE)
            .post("/api/add")
            .send({
                description: "choco",
                category: "food",
                userid: 900001,
                sum: 12,
                createdAt: future
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("description", "choco");
        expect(res.body).toHaveProperty("category", "food");
        expect(res.body).toHaveProperty("userid", 900001);
        expect(res.body).toHaveProperty("sum");
    });

    test("POST /api/add rejects past cost", async () => {
        const past = new Date(Date.now() - 60 * 1000).toISOString();

        const res = await request(COSTS_BASE)
            .post("/api/add")
            .send({
                description: "old",
                category: "food",
                userid: 900001,
                sum: 1,
                createdAt: past
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });

    test("GET /api/report returns report JSON", async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const res = await request(COSTS_BASE).get(
            `/api/report?id=900001&year=${year}&month=${month}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("userid", 900001);
        expect(res.body).toHaveProperty("year", year);
        expect(res.body).toHaveProperty("month", month);
        expect(res.body).toHaveProperty("costs");
        expect(Array.isArray(res.body.costs)).toBe(true);
    });
});
