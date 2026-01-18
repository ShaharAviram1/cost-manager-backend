// services/logs-service/index.js
require("dotenv").config();
const { connectToMongo } = require("../../models/db");
const { buildLogsApp } = require("./app");

async function main() {
    await connectToMongo();

    const app = buildLogsApp();
    const port = Number(process.env.PORT_LOGS || 3003);

    app.listen(port, () => {
        console.log(`logs-service running on ${port}`);
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
