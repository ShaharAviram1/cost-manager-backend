// services/users-service/index.js
require("dotenv").config();
const { connectToMongo } = require("../../models/db");
const { buildUsersApp } = require("./app");

async function main() {
    await connectToMongo();

    const app = buildUsersApp();
    const port = Number(process.env.PORT || process.env.PORT_USERS || 3001);

    app.listen(port, () => {
        console.log(`users-service running on ${port}`);
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
