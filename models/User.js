// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true, index: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        birthday: { type: Date, required: true }
    },
    { versionKey: false }
);

module.exports = mongoose.model("User", UserSchema, "users");
