// common/logger.js
const pino = require("pino");
const Log = require("../models/Log");

/**
 * Requirement:
 * - Use Pino
 * - Save log messages into MongoDB
 * - Log every HTTP request
 * - Also log whenever an endpoint is accessed
 */
function createLogger(serviceName) {
    const logger = pino({ name: serviceName });

    function requestLogger(req, res, next) {
        const start = Date.now();

        res.on("finish", async () => {
            const ms = Date.now() - start;
            const msg = `${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`;
            logger.info(msg);

            try {
                await Log.create({
                    service: serviceName,
                    level: "info",
                    method: req.method,
                    path: req.originalUrl,
                    status: res.statusCode,
                    message: msg,
                    meta: { ms }
                });
            } catch (e) {
                logger.error({ err: e }, "Failed writing request log to DB");
            }
        });

        next();
    }

    // Call this inside each endpoint handler (this creates the extra endpoint-access log).
    async function endpointAccessLog(req, res, endpointName) {
        const msg = `Endpoint accessed: ${endpointName}`;
        logger.info(msg);

        try {
            await Log.create({
                service: serviceName,
                level: "info",
                method: req.method,
                path: req.originalUrl,
                status: res.statusCode || 200,
                message: msg
            });
        } catch (e) {
            logger.error({ err: e }, "Failed writing endpoint log to DB");
        }
    }

    return { logger, requestLogger, endpointAccessLog };
}

module.exports = { createLogger };
