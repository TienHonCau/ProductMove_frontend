const mongoose = require("mongoose");

const productlineSchema = new mongoose.Schema(
    {        
        productLine: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        image: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
        },
        madeIn: {
            type: String,
        }

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Productlines", productlineSchema);
