/*
 * Central definition of allowed cost categories.
 * These values are enforced by the costs service when adding cost items
 * and are shared across the application to avoid duplication and inconsistency.
 */
// List of valid categories accepted by the API
const CATEGORIES = [
    "food",
    "education",
    "health",
    "housing",
    "sports"
];
// Export categories for reuse across services and models
module.exports = CATEGORIES;