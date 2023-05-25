const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productLine: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique:true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        guaranteeTime: {
            type: Number,
            required: true,
        },
        spec: {
            type: String,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Products", productSchema);
