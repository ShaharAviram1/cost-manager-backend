const mongoose = require("mongoose");

async function connectToMongo() {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URI);
}

module.exports = { connectToMongo };
