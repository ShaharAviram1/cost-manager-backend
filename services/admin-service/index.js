// services/admin-service/index.js
require("dotenv").config();
const { connectToMongo } = require("../../models/db");
const { buildAdminApp } = require("./app");

async function main() {
    await connectToMongo();

    const app = buildAdminApp();
    const port = Number(process.env.PORT || process.env.PORT_ADMIN || 3004);

    app.listen(port, () => {
        console.log(`admin-service running on ${port}`);
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
