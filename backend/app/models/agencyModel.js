const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        address: {
            type: String,
        },
        sdt: {
            type: String,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Agencies", agencySchema);
