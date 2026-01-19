/*
 * Utility function for creating standardized error responses.
 * All services use this helper to return errors in a consistent JSON format
 * containing an error id and a human-readable message, as required by the assignment.
 */

// Build a JSON error object with an id and message
function errorJson(id, message) {
    return { id, message };
}

// Export the error helper for reuse across all services
module.exports = { errorJson };
