const mongoose = require("mongoose");

const storageAgencySchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },
        idAgency: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Storage-Agencies", storageAgencySchema);
