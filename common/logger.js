/*
 * Centralized logging utility based on Pino.
 * This module is responsible for:
 * - logging every incoming HTTP request
 * - logging explicit endpoint access events
 * - persisting logs into MongoDB via the Log model
 * It is shared across all services to keep logging consistent.
 */
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
// Factory function that creates a logger instance scoped to a specific service
function createLogger(serviceName) {
    const logger = pino({ name: serviceName });

    // Express middleware that logs every HTTP request after the response is finished
    function requestLogger(req, res, next) {
        const start = Date.now();

        // Wait until the response is sent so status code and duration are known
        res.on("finish", async () => {
            const ms = Date.now() - start;
            const msg = `${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`;
            logger.info(msg);

            // Persist the request log entry into MongoDB
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

    // Explicit endpoint-access logger (called manually inside route handlers)
    async function endpointAccessLog(req, res, endpointName) {
        const msg = `Endpoint accessed: ${endpointName}`;
        logger.info(msg);

        // Persist the endpoint-access log entry into MongoDB
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

    // Expose logger instance and middleware/helpers to the service
    return { logger, requestLogger, endpointAccessLog };
}

// Export the logger factory for use by all services
module.exports = { createLogger };
