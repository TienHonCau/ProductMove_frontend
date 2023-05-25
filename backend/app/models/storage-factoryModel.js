const mongoose = require("mongoose");

const storageFactorySchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },
        idFactory: {
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

module.exports = mongoose.model("Storage-Factories", storageFactorySchema);
