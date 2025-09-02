const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: function() {
            // Password is required only if googleId is not present
            return !this.googleId;
        },
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values but ensures uniqueness when present
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", UserSchema);