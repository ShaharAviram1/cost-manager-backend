// services/logs-service/app.js
const express = require("express");
const cors = require("cors");
const { createLogger } = require("../../common/logger");
const routes = require("./routes");

function buildLogsApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    const { requestLogger } = createLogger("logs-service");
    app.use(requestLogger);

    app.use("/api", routes);

    return app;
}

module.exports = { buildLogsApp };
